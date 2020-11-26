import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
dotenv.config();

const ENV_VARS = { NODE_ENV: '', PORT: '', AWS_ACCOUNT_ID: '', AWS_QUEUE_NAME: '', AWS_REGION: '' };
type EnvConfig = typeof ENV_VARS;

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    const envVars = ENV_VARS;
    Object.keys(ENV_VARS).forEach((name) => (envVars[name] = this.getEnvVar(name)));
    this.envConfig = this.validateInput(envVars);
  }

  private getEnvVar(name: string): string {
    return process.env[name];
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string().default('local').valid('local', 'development', 'production', 'test'),
      PORT: Joi.number().default(3000)
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig);
    if (error) {
      throw new Error(error);
    }

    return validatedEnvConfig;
  }

  get env(): string {
    return String(this.envConfig.NODE_ENV);
  }

  get port(): number {
    return Number(this.envConfig.PORT);
  }

  get(key: string): string {
    const variable = this.getEnvVar(key);
    if (!variable) {
      throw new Error('Config variable does not exist: ' + key);
    }

    return variable;
  }
}

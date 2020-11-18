import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
dotenv.config();

export type EnvConfig = Record<string, string>;

@Injectable()
export class ConfigService {
  private readonly EnvVarsNames = ['NODE_ENV', 'PORT'];
  private readonly envConfig: EnvConfig;

  constructor() {
    const envVars: { [key: string]: string } = {};
    this.EnvVarsNames.forEach((name) => (envVars[name] = this.getEnvVar(name)));
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

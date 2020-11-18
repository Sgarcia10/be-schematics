import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { IHealthService } from 'src/domain/interfaces/health-service.interface';
import { HealthService } from 'src/core/services/health.service';
import { ConfigService } from 'src/config/config.service';
import { HealthDto } from 'src/common/dtos/response/health.dto';
import { HealthController } from 'src/app/controllers/health.controller';

describe('HealthService', () => {
  let healthService: IHealthService;
  let configService: ConfigService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [HealthService, Logger, ConfigService],
      controllers: [HealthController]
    }).compile();
    healthService = module.get<IHealthService>(HealthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('get', () => {
    it('should return health', () => {
      const result: HealthDto = { status: 'UP' };

      expect(healthService.get()).toMatchObject(result);
    });

    it('should throw Error when variable not exists', () => {
      expect.assertions(1);
      try {
        configService.get('Var');
      } catch (e) {
        expect(e.message).toBe('Config variable does not exist: Var');
      }
    });
  });
});

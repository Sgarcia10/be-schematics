import { Module, Global } from '@nestjs/common';
import { Logger } from './logger.service';

@Global()
@Module({
  imports: [],
  providers: [Logger],
  exports: [Logger]
})
export class LoggerModule {}

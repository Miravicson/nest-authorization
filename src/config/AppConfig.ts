import { Configuration, Value } from '@itgorillaz/configify/dist';
import { IsNotEmpty, IsNumber } from 'class-validator';

export type NodeEnv = 'development' | 'production' | 'test';

@Configuration()
export class AppConfig {
  @IsNumber()
  @IsNotEmpty()
  @Value('PORT', { parse: Number.parseInt })
  port: number;

  @Value('NODE_ENV', { default: 'development' })
  nodeEnv: NodeEnv;
}

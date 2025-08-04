import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Trilha } from '../entities/trilha.entity';
import { Modulo } from '../entities/modulo.entity';
import { Aula } from '../entities/aula.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST', 'localhost'),
  port: configService.get<number>('DATABASE_PORT', 5432),
  username: configService.get<string>('DATABASE_USERNAME', 'postgres'),
  password: configService.get<string>('DATABASE_PASSWORD', 'password'),
  database: configService.get<string>('DATABASE_NAME', 'puljante'),
  entities: [User, Trilha, Modulo, Aula],
  synchronize: true, // Em produção, usar migrations
  logging: false,
});

// Configuração estática para compatibilidade (será removida)
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'puljante',
  entities: [User, Trilha, Modulo, Aula],
  synchronize: true, // Em produção, usar migrations
  logging: false,
};


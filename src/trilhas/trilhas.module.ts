import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { TrilhasController } from './trilhas.controller';
import { TrilhasService } from './trilhas.service';
import { Trilha } from '../entities/trilha.entity';
import { Modulo } from '../entities/modulo.entity';
import { Aula } from '../entities/aula.entity';
import { VideoService } from './video.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trilha, Modulo, Aula]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
      },
    }),
  ],
  controllers: [TrilhasController],
  providers: [TrilhasService, VideoService],
})
export class TrilhasModule {}


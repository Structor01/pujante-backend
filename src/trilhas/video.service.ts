import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';

const execAsync = promisify(exec);

@Injectable()
export class VideoService {
  private readonly uploadsDir = './uploads';
  private readonly videosDir = './uploads/videos';
  private readonly thumbnailsDir = './uploads/thumbnails';

  constructor() {
    // Criar diretórios se não existirem
    [this.uploadsDir, this.videosDir, this.thumbnailsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async processVideo(inputPath: string, filename: string): Promise<{
    optimizedPath: string;
    thumbnailPath: string;
    duration: number;
  }> {
    const inputFullPath = path.resolve(inputPath);
    const outputFilename = `optimized_${filename}`;
    const outputPath = path.join(this.videosDir, outputFilename);
    const thumbnailFilename = `thumb_${filename.replace(/\.[^/.]+$/, '.jpg')}`;
    const thumbnailPath = path.join(this.thumbnailsDir, thumbnailFilename);

    try {
      // Otimizar vídeo (compressão H.264, redimensionar se necessário)
      const optimizeCommand = `ffmpeg -i "${inputFullPath}" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart -vf "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease" "${outputPath}"`;
      
      await execAsync(optimizeCommand);

      // Gerar thumbnail
      const thumbnailCommand = `ffmpeg -i "${outputPath}" -ss 00:00:01 -vframes 1 -f image2 "${thumbnailPath}"`;
      
      await execAsync(thumbnailCommand);

      // Obter duração do vídeo
      const durationCommand = `ffprobe -v quiet -show_entries format=duration -of csv="p=0" "${outputPath}"`;
      const { stdout } = await execAsync(durationCommand);
      const duration = Math.round(parseFloat(stdout.trim()));

      // Remover arquivo original
      if (fs.existsSync(inputFullPath)) {
        fs.unlinkSync(inputFullPath);
      }

      return {
        optimizedPath: outputPath,
        thumbnailPath: thumbnailPath,
        duration: duration,
      };

    } catch (error) {
      console.error('Erro ao processar vídeo:', error);
      throw new Error('Falha no processamento do vídeo');
    }
  }

  async getVideoInfo(videoPath: string): Promise<{
    duration: number;
    width: number;
    height: number;
    size: number;
  }> {
    try {
      const infoCommand = `ffprobe -v quiet -print_format json -show_format -show_streams "${videoPath}"`;
      const { stdout } = await execAsync(infoCommand);
      const info = JSON.parse(stdout);
      
      const videoStream = info.streams.find(stream => stream.codec_type === 'video');
      const format = info.format;

      return {
        duration: Math.round(parseFloat(format.duration)),
        width: videoStream.width,
        height: videoStream.height,
        size: parseInt(format.size),
      };
    } catch (error) {
      console.error('Erro ao obter informações do vídeo:', error);
      throw new Error('Falha ao obter informações do vídeo');
    }
  }

  getVideoUrl(filename: string): string {
    return `/uploads/videos/${filename}`;
  }

  getThumbnailUrl(filename: string): string {
    return `/uploads/thumbnails/${filename}`;
  }
}


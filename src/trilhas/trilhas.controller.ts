import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  UseInterceptors, 
  UploadedFile,
  ParseIntPipe,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TrilhasService } from './trilhas.service';
import { VideoService } from './video.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTrilhaDto } from './dto/create-trilha.dto';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { CreateAulaDto } from './dto/create-aula.dto';

@Controller('trilhas')
@UseGuards(JwtAuthGuard)
export class TrilhasController {
  constructor(
    private trilhasService: TrilhasService,
    private videoService: VideoService,
  ) {}

  // TRILHAS
  @Post()
  @UseInterceptors(FileInterceptor('capa'))
  async createTrilha(
    @Body() createTrilhaDto: CreateTrilhaDto,
    @UploadedFile() capa?: Express.Multer.File,
  ) {
    const capaUrl = capa ? `/uploads/${capa.filename}` : undefined;
    return this.trilhasService.createTrilha(createTrilhaDto, capaUrl);
  }

  @Get()
  async findAllTrilhas() {
    return this.trilhasService.findAllTrilhas();
  }

  @Get(':id')
  async findTrilhaById(@Param('id', ParseIntPipe) id: number) {
    return this.trilhasService.findTrilhaById(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('capa'))
  async updateTrilha(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateTrilhaDto>,
    @UploadedFile() capa?: Express.Multer.File,
  ) {
    const capaUrl = capa ? `/uploads/${capa.filename}` : undefined;
    return this.trilhasService.updateTrilha(id, updateData, capaUrl);
  }

  @Delete(':id')
  async deleteTrilha(@Param('id', ParseIntPipe) id: number) {
    return this.trilhasService.deleteTrilha(id);
  }

  // MÓDULOS
  @Post('modulos')
  async createModulo(@Body() createModuloDto: CreateModuloDto) {
    return this.trilhasService.createModulo(createModuloDto);
  }

  @Get(':trilhaId/modulos')
  async findModulosByTrilha(@Param('trilhaId', ParseIntPipe) trilhaId: number) {
    return this.trilhasService.findModulosByTrilha(trilhaId);
  }

  @Put('modulos/:id')
  async updateModulo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateModuloDto>,
  ) {
    return this.trilhasService.updateModulo(id, updateData);
  }

  @Delete('modulos/:id')
  async deleteModulo(@Param('id', ParseIntPipe) id: number) {
    return this.trilhasService.deleteModulo(id);
  }

  // AULAS
  @Post('aulas')
  @UseInterceptors(FileInterceptor('video'))
  async createAula(
    @Body() createAulaDto: CreateAulaDto,
    @UploadedFile() video?: Express.Multer.File,
  ) {
    let videoPath: string;
    let thumbnailUrl: string;
    let duracao: number;

    if (video) {
      try {
        const processedVideo = await this.videoService.processVideo(video.path, video.filename);
        videoPath = processedVideo.optimizedPath;
        thumbnailUrl = this.videoService.getThumbnailUrl(processedVideo.thumbnailPath.split('/').pop());
        duracao = processedVideo.duration;
        
        // Atualizar DTO com duração
        createAulaDto.duracao = duracao;
      } catch (error) {
        throw new BadRequestException('Erro ao processar vídeo: ' + error.message);
      }
    }

    return this.trilhasService.createAula(createAulaDto, videoPath, thumbnailUrl);
  }

  @Get('modulos/:moduloId/aulas')
  async findAulasByModulo(@Param('moduloId', ParseIntPipe) moduloId: number) {
    return this.trilhasService.findAulasByModulo(moduloId);
  }

  @Get('aulas/:id')
  async findAulaById(@Param('id', ParseIntPipe) id: number) {
    return this.trilhasService.findAulaById(id);
  }

  @Put('aulas/:id')
  @UseInterceptors(FileInterceptor('video'))
  async updateAula(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateAulaDto>,
    @UploadedFile() video?: Express.Multer.File,
  ) {
    let videoPath: string;
    let thumbnailUrl: string;

    if (video) {
      try {
        const processedVideo = await this.videoService.processVideo(video.path, video.filename);
        videoPath = processedVideo.optimizedPath;
        thumbnailUrl = this.videoService.getThumbnailUrl(processedVideo.thumbnailPath.split('/').pop());
        updateData.duracao = processedVideo.duration;
      } catch (error) {
        throw new BadRequestException('Erro ao processar vídeo: ' + error.message);
      }
    }

    return this.trilhasService.updateAula(id, updateData, videoPath, thumbnailUrl);
  }

  @Delete('aulas/:id')
  async deleteAula(@Param('id', ParseIntPipe) id: number) {
    return this.trilhasService.deleteAula(id);
  }
}


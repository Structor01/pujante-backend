import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trilha } from '../entities/trilha.entity';
import { Modulo } from '../entities/modulo.entity';
import { Aula } from '../entities/aula.entity';
import { CreateTrilhaDto } from './dto/create-trilha.dto';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { CreateAulaDto } from './dto/create-aula.dto';

@Injectable()
export class TrilhasService {
  constructor(
    @InjectRepository(Trilha)
    private trilhaRepository: Repository<Trilha>,
    @InjectRepository(Modulo)
    private moduloRepository: Repository<Modulo>,
    @InjectRepository(Aula)
    private aulaRepository: Repository<Aula>,
  ) {}

  // TRILHAS
  async createTrilha(createTrilhaDto: CreateTrilhaDto, capaUrl?: string) {
    const trilha = this.trilhaRepository.create({
      ...createTrilhaDto,
      capa_url: capaUrl,
    });
    return await this.trilhaRepository.save(trilha);
  }

  async findAllTrilhas() {
    return await this.trilhaRepository.find({
      where: { ativo: true },
      relations: ['modulos'],
      order: { created_at: 'DESC' },
    });
  }

  async findTrilhaById(id: number) {
    const trilha = await this.trilhaRepository.findOne({
      where: { id, ativo: true },
      relations: ['modulos', 'modulos.aulas'],
    });
    if (!trilha) {
      throw new NotFoundException('Trilha não encontrada');
    }
    return trilha;
  }

  async updateTrilha(id: number, updateData: Partial<CreateTrilhaDto>, capaUrl?: string) {
    const trilha = await this.findTrilhaById(id);
    Object.assign(trilha, updateData);
    if (capaUrl) {
      trilha.capa_url = capaUrl;
    }
    return await this.trilhaRepository.save(trilha);
  }

  async deleteTrilha(id: number) {
    const trilha = await this.findTrilhaById(id);
    trilha.ativo = false;
    return await this.trilhaRepository.save(trilha);
  }

  // MÓDULOS
  async createModulo(createModuloDto: CreateModuloDto) {
    const trilha = await this.findTrilhaById(createModuloDto.trilha_id);
    const modulo = this.moduloRepository.create(createModuloDto);
    return await this.moduloRepository.save(modulo);
  }

  async findModulosByTrilha(trilhaId: number) {
    return await this.moduloRepository.find({
      where: { trilha_id: trilhaId, ativo: true },
      relations: ['aulas'],
      order: { ordem: 'ASC' },
    });
  }

  async updateModulo(id: number, updateData: Partial<CreateModuloDto>) {
    const modulo = await this.moduloRepository.findOne({ where: { id } });
    if (!modulo) {
      throw new NotFoundException('Módulo não encontrado');
    }
    Object.assign(modulo, updateData);
    return await this.moduloRepository.save(modulo);
  }

  async deleteModulo(id: number) {
    const modulo = await this.moduloRepository.findOne({ where: { id } });
    if (!modulo) {
      throw new NotFoundException('Módulo não encontrado');
    }
    modulo.ativo = false;
    return await this.moduloRepository.save(modulo);
  }

  // AULAS
  async createAula(createAulaDto: CreateAulaDto, videoPath?: string, thumbnailUrl?: string) {
    const modulo = await this.moduloRepository.findOne({ where: { id: createAulaDto.modulo_id } });
    if (!modulo) {
      throw new NotFoundException('Módulo não encontrado');
    }

    const aula = this.aulaRepository.create({
      ...createAulaDto,
      video_path: videoPath,
      thumbnail_url: thumbnailUrl,
    });
    
    return await this.aulaRepository.save(aula);
  }

  async findAulasByModulo(moduloId: number) {
    return await this.aulaRepository.find({
      where: { modulo_id: moduloId, ativo: true },
      order: { ordem: 'ASC' },
    });
  }

  async findAulaById(id: number) {
    const aula = await this.aulaRepository.findOne({
      where: { id, ativo: true },
      relations: ['modulo', 'modulo.trilha'],
    });
    if (!aula) {
      throw new NotFoundException('Aula não encontrada');
    }
    return aula;
  }

  async updateAula(id: number, updateData: Partial<CreateAulaDto>, videoPath?: string, thumbnailUrl?: string) {
    const aula = await this.findAulaById(id);
    Object.assign(aula, updateData);
    if (videoPath) {
      aula.video_path = videoPath;
    }
    if (thumbnailUrl) {
      aula.thumbnail_url = thumbnailUrl;
    }
    return await this.aulaRepository.save(aula);
  }

  async deleteAula(id: number) {
    const aula = await this.findAulaById(id);
    aula.ativo = false;
    return await this.aulaRepository.save(aula);
  }
}


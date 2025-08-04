import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAulaDto {
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNotEmpty({ message: 'Ordem é obrigatória' })
  @IsNumber()
  ordem: number;

  @IsNotEmpty({ message: 'ID do módulo é obrigatório' })
  @IsNumber()
  modulo_id: number;

  @IsOptional()
  @IsString()
  video_url?: string;

  @IsOptional()
  @IsNumber()
  duracao?: number;
}


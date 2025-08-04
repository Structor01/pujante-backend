import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateModuloDto {
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNotEmpty({ message: 'Ordem é obrigatória' })
  @IsNumber()
  ordem: number;

  @IsNotEmpty({ message: 'ID da trilha é obrigatório' })
  @IsNumber()
  trilha_id: number;
}


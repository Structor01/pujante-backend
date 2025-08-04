import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTrilhaDto {
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @IsString()
  titulo: string;

  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @IsString()
  descricao: string;

  @IsOptional()
  @IsString()
  capa_url?: string;
}


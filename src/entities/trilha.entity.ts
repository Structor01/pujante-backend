import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Modulo } from './modulo.entity';

@Entity('trilhas')
export class Trilha {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column('text')
  descricao: string;

  @Column({ nullable: true })
  capa_url: string;

  @Column({ default: 0 })
  duracao_total: number; // em minutos

  @Column({ default: 0 })
  total_aulas: number;

  @Column({ default: true })
  ativo: boolean;

  @OneToMany(() => Modulo, modulo => modulo.trilha)
  modulos: Modulo[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Modulo } from './modulo.entity';

@Entity('aulas')
export class Aula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column('text', { nullable: true })
  descricao: string;

  @Column()
  ordem: number;

  @Column()
  modulo_id: number;

  @Column({ nullable: true })
  video_url: string;

  @Column({ nullable: true })
  video_path: string; // caminho local do arquivo

  @Column({ default: 0 })
  duracao: number; // em segundos

  @Column({ nullable: true })
  thumbnail_url: string;

  @ManyToOne(() => Modulo, modulo => modulo.aulas)
  @JoinColumn({ name: 'modulo_id' })
  modulo: Modulo;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


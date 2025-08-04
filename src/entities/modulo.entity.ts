import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Trilha } from './trilha.entity';
import { Aula } from './aula.entity';

@Entity('modulos')
export class Modulo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column('text', { nullable: true })
  descricao: string;

  @Column()
  ordem: number;

  @Column()
  trilha_id: number;

  @ManyToOne(() => Trilha, trilha => trilha.modulos)
  @JoinColumn({ name: 'trilha_id' })
  trilha: Trilha;

  @OneToMany(() => Aula, aula => aula.modulo)
  aulas: Aula[];

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


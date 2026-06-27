import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('personas')
export class PersonaEntity {
  @PrimaryColumn()
  rut!: string;

  @Column()
  nombre!: string;

  @Column({ type: 'date' })
  nacimiento!: Date;

  @Column()
  ciudad!: string;

  @Column('text', { array: true, default: [] })
  gustos!: string[];
}
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  create: Date;

  @Column()
  name: string;

  constructor(name: string) {
    this.create = new Date();
    this.name = name;
  }
}

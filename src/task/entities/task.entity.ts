import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  create: Date;

  @Column()
  name: string;

  @Column({ default: false })
  status: boolean;

  constructor(name: string) {
    this.create = new Date();
    this.name = name;
  }
}

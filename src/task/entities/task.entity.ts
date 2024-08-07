import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createDate!: Date;

  @Column()
  name: string;

  @Column({ default: false })
  status!: boolean;
}

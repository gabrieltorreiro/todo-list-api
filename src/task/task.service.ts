import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_REPOSITORY')
    private taskRepository: Repository<Task>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = this.taskRepository.create(createTaskDto);
    await this.taskRepository.save(newTask);
    return newTask;
  }

  async findAll(): Promise<Task[]> {
    const tasks = await this.taskRepository.find();
    return tasks;
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const targetTask = await this.taskRepository.findOneBy({ id });
    if (!targetTask) throw new NotFoundException('Task not found');
    const updatedTask = this.taskRepository.merge(targetTask, updateTaskDto);
    await this.taskRepository.save(updatedTask);
    return updatedTask;
  }

  async remove(id: number) {
    const targetTask = await this.taskRepository.findOneBy({ id });
    if (!targetTask) throw new NotFoundException('Task not found');
    await this.taskRepository.remove(targetTask);
    return 'removed';
  }
}

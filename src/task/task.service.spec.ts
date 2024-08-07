import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';

describe('TaskService', () => {
  let service: TaskService;
  const mockTaskRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: 'TASK_REPOSITORY', useValue: mockTaskRepository },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  describe('findOne', () => {
    it('should throw an error when the task ID is not found in the database', async () => {
      mockTaskRepository.findOneBy.mockResolvedValue(null);

      const status = service.findOne(1);

      await expect(status).rejects.toThrow(NotFoundException);
      expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockTaskRepository.save).not.toHaveBeenCalled();
    });

    it('should return the task when the task ID is found in the database', async () => {
      const task: Task = {
        createDate: new Date(),
        id: 1,
        name: 'task 1',
        status: false,
      };
      mockTaskRepository.findOneBy.mockResolvedValue(task);

      const returnedTask = await service.findOne(1);

      expect(returnedTask).toEqual(task);
      expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockTaskRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('doneTask', () => {
    it('should throw an error when trying to mark a non-existent task as done', async () => {
      mockTaskRepository.findOneBy.mockResolvedValue(null);

      await expect(service.doneTask(1)).rejects.toThrow(NotFoundException);
      expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockTaskRepository.save).not.toHaveBeenCalled();
    });

    it('should update the status of a task to done when the task ID is valid', async () => {
      const task: Task = {
        createDate: new Date(),
        id: 1,
        name: 'task 1',
        status: false,
      };
      mockTaskRepository.findOneBy.mockResolvedValue(task);

      const updatedTask = await service.doneTask(1);

      expect(updatedTask.status).toBe(true);
      expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockTaskRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, status: true }),
      );
    });
  });

  describe('undoneTask', () => {
    it('should throw an error when trying to mark a non-existent task as undone', async () => {
      mockTaskRepository.findOneBy.mockResolvedValue(null);

      const task = service.undoneTask(1);

      await expect(task).rejects.toThrow(NotFoundException);
      expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockTaskRepository.save).not.toHaveBeenCalled();
    });

    it('should update the status of a task to undone when the task ID is valid', async () => {
      const task: Task = {
        createDate: new Date(),
        id: 1,
        name: 'task 6',
        status: true,
      };
      mockTaskRepository.findOneBy.mockResolvedValue(task);

      const updatedTask = await service.undoneTask(1);

      expect(updatedTask.status).toBe(false);
      expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockTaskRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, status: false }),
      );
    });
  });
});

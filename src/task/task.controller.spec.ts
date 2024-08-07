import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            doneTask: jest.fn().mockResolvedValue([]),
            undoneTask: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    taskController = app.get<TaskController>(TaskController);
    taskService = app.get<TaskService>(TaskService);
  });

  describe('findAll', () => {
    it('should return an empty array when there are no tasks in the database', async () => {
      // Assert
      const result: Task[] = [];
      jest.spyOn(taskService, 'findAll').mockResolvedValue(result);

      // Act
      const target = await taskController.findAll();

      // Arrange
      expect(target).toBe(result);
    });

    it('should return an array of tasks when there are tasks in the database', async () => {
      // Arrange
      const tasks: Partial<Task>[] = [
        { id: 1, name: 'Task 1' },
        { id: 2, name: 'Task 2' },
      ];
      jest.spyOn(taskService, 'findAll').mockResolvedValue(tasks as Task[]);

      // Act
      const target = await taskController.findAll();

      // Assert
      expect(target).toEqual(tasks);
    });
  });

  describe('doneTask', () => {
    it('should return a 404 error when the task ID does not exist in the database', async () => {
      // Arrange
      const taskId = 9999;
      jest
        .spyOn(taskService, 'doneTask')
        .mockRejectedValue(new Error('Task not found'));

      // Act
      const target = taskController.doneTask(taskId.toString());

      // Assert
      await expect(target).rejects.toThrow('Task not found');
    });

    it('should update the task status to "done" when the "/done" endpoint is called', async () => {
      // Arrange
      const taskId = 1;
      const updatedTask: Partial<Task> = { id: taskId, status: true };
      jest
        .spyOn(taskService, 'doneTask')
        .mockResolvedValue(updatedTask as Task);

      // Act
      const target = await taskController.doneTask(taskId.toString());

      // Assert
      expect(target).toEqual(updatedTask);
    });
  });

  describe('undoneTask', () => {
    it('should return a 404 error when the task ID does not exist in the database', async () => {
      // Arrange
      const taskId = 9999;
      jest
        .spyOn(taskService, 'undoneTask')
        .mockRejectedValue(new Error('Task not found'));

      // Act
      const target = taskController.undoneTask(taskId.toString());

      // Assert
      await expect(target).rejects.toThrow('Task not found');
    });

    it('should update the task status to "undone" when the "/undone" endpoint is called', async () => {
      // Arrange
      const taskId = 1;
      const updatedTask: Partial<Task> = { id: taskId, status: false };
      jest
        .spyOn(taskService, 'undoneTask')
        .mockResolvedValue(updatedTask as Task);

      // Act
      const target = await taskController.undoneTask(taskId.toString());

      // Assert
      expect(target).toEqual(updatedTask);
    });
  });
});

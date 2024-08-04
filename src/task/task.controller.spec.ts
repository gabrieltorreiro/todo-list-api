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
});

import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './entities/status.enum';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;
  let tenantRepository: Repository<Tenant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Tenant),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    tenantRepository = module.get<Repository<Tenant>>(getRepositoryToken(Tenant));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        dueDate: new Date().toISOString(),
        tenantId: '1',
      };
      const tenant: Tenant = { id: '1', name: 'Test Tenant' } as Tenant;
      const task: Task = {
        id: '1',
        ...createTaskDto,
        tenant,
        createdAt: new Date(),  
      } as Task;

      jest.spyOn(tenantRepository, 'findOneBy').mockResolvedValue(tenant);
      jest.spyOn(taskRepository, 'create').mockReturnValue(task);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(task);

      const result = await service.create(createTaskDto);
      expect(result).toEqual(task);
      expect(tenantRepository.findOneBy).toHaveBeenCalledWith({ id: createTaskDto.tenantId });
      expect(taskRepository.create).toHaveBeenCalledWith({ ...createTaskDto, tenant });
      expect(taskRepository.save).toHaveBeenCalledWith(task);
    });

    it('should throw NotFoundException if tenant is not found', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        dueDate: new Date().toISOString(),
        tenantId: '1',
      };

      jest.spyOn(tenantRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.create(createTaskDto)).rejects.toThrow(NotFoundException);
      expect(tenantRepository.findOneBy).toHaveBeenCalledWith({ id: createTaskDto.tenantId });
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const tasks: Task[] = [{ id: '1', title: 'Test Task' } as Task];

      jest.spyOn(taskRepository, 'find').mockResolvedValue(tasks);

      const result = await service.findAll();
      expect(result).toEqual(tasks);
      expect(taskRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a task by ID', async () => {
      const task: Task = { id: '1', title: 'Test Task' } as Task;
  
      jest.spyOn(taskRepository, 'preload').mockResolvedValue(task);
  
      const result = await service.findOne('1');
      expect(result).toEqual(task);
      expect(taskRepository.preload).toHaveBeenCalledWith({ id: '1', ...UpdateTaskDto });
    });
  
    it('should throw NotFoundException if task is not found', async () => {
      jest.spyOn(taskRepository, 'preload').mockResolvedValue(null);
  
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(taskRepository.preload).toHaveBeenCalledWith({ id: '1', ...UpdateTaskDto });
    });
  });

  describe('update', () => {
    it('should update and return a task', async () => {
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
      const task: Task = { id: '1', ...updateTaskDto } as Task;

      jest.spyOn(taskRepository, 'preload').mockResolvedValue(task);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(task);

      const result = await service.update('1', updateTaskDto);
      expect(result).toEqual(task);
      expect(taskRepository.preload).toHaveBeenCalledWith({ id: '1', ...updateTaskDto });
      expect(taskRepository.save).toHaveBeenCalledWith(task);
    });

    it('should throw NotFoundException if task is not found', async () => {
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };

      jest.spyOn(taskRepository, 'preload').mockResolvedValue(null);

      await expect(service.update('1', updateTaskDto)).rejects.toThrow(NotFoundException);
      expect(taskRepository.preload).toHaveBeenCalledWith({ id: '1', ...updateTaskDto });
    });
  });

  describe('remove', () => {
    it('should delete a task and return success message', async () => {
      jest.spyOn(taskRepository, 'delete').mockResolvedValue({ affected: 1 } as DeleteResult);

      const result = await service.remove('1');
      expect(result).toEqual({ message: `Task with the id: 1 was successfully removed` });
      expect(taskRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if task is not found', async () => {
      jest.spyOn(taskRepository, 'delete').mockResolvedValue({ affected: 0 } as DeleteResult);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
      expect(taskRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});

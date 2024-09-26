import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { Tenant } from 'src/tenants/entities/tenant.entity';

@Injectable()
export class TasksService {

  private readonly logger = new Logger('TasksService');

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,

  ) { }

  async create(createTaskDto: CreateTaskDto) {
    try {
      const { title, description, status, dueDate, tenantId } = createTaskDto;

      const tenant = await this.tenantRepository.findOneBy({ id: tenantId });
      if (!tenant) {
        throw new NotFoundException('Tenant not found');
      }

      const task = this.taskRepository.create({
        title,
        description,
        status,
        dueDate,
        tenant,
      });

      return this.taskRepository.save(task);
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Something went wrong, check logs..!');
    }
  }

  async findAll() {
    return await this.taskRepository.find();
  }

  async findOne(id: string) {
    try {
      const task = await this.taskRepository.findOneBy({ id });
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return task;
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Something went wrong, check logs')
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.findOne(id);

      Object.assign(task, updateTaskDto);

      return this.taskRepository.save(task);

    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Something went wrong, check logs')
    }
  }

  async remove(id: string) {
    try {
      const result = await this.taskRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return { message: `Task with the id: ${id} was successfully removed` }
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Something went wrong, check logs')
    }
  }
}

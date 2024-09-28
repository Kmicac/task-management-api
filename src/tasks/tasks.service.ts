import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Tenant } from '../tenants/entities/tenant.entity';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,

  ) { }

  async create(createTaskDto: CreateTaskDto) {

    const { tenantId, ...taskData } = createTaskDto;

    const tenant = await this.tenantRepository.findOneBy({ id: tenantId });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const task = this.taskRepository.create({
      tenant,
      ...taskData,
    });

    await this.taskRepository.save(task);
    return task;

  }

  async findAll() {
    const allTasks = await this.taskRepository.find();
    return allTasks;
  }

  async findOne(id: string) {
      const task = await this.taskRepository.preload({
        id: id,
        ...UpdateTaskDto
      });
      if (!task) {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.preload({
      id: id,
      ...updateTaskDto
    })
    if (!task) throw new NotFoundException(`task with id: ${id} not found`);
    await this.taskRepository.save(task);

    return task;
  }

  async remove(id: string) {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return { message: `Task with the id: ${id} was successfully removed` }
  }
}

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {

  private readonly logger = new Logger('TasksService');

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>

  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {

      const task = this.taskRepository.create(createTaskDto)
      await this.taskRepository.save( task );

      return task;
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Something went wrong, check logs..!');
    }
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}

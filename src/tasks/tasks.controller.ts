import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Auth } from '../users/decorators/auth.decorator';
import { Role } from '../users/interfaces/role.enum';
import { Task } from './entities/task.entity';

@ApiTags('Tasks')
@Controller('tasks')
@Auth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' }) 
  @ApiBody({ type: CreateTaskDto })  
  @ApiResponse({ status: 201, description: 'The task has been successfully created.', type: Task })  
  @ApiResponse({ status: 400, description: 'Bad Request.' })  
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all tasks' })
  @ApiResponse({ status: 200, description: 'List of all tasks.', type: [Task] })  
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a task by ID' })
  @ApiResponse({ status: 200, description: 'Task found.', type: Task })  
  @ApiResponse({ status: 404, description: 'Task not found.' }) 
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.Admin) 
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiBody({ type: UpdateTaskDto })  
  @ApiResponse({ status: 200, description: 'Task updated successfully.', type: Task })  
  @ApiResponse({ status: 404, description: 'Task not found.' }) 
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @Auth(Role.Admin) 
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({ status: 200, description: 'Task successfully removed.' }) 
  @ApiResponse({ status: 404, description: 'Task not found.' })  
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDTO: GetTasksFilterDto): Promise<Task[]> {
    // if (Object.keys(filterDTO).length)
    // return this.tasksService.getTasksWithFilters(filterDTO);
    /* else */ return this.tasksService.getAllTasks(filterDTO);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.tasksService.createTasks(createTaskDTO);
  }

  @Patch('/:id')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskDTO,
  ): Promise<Task> {
    const { title, description, status } = updateTaskStatusDto;
    return this.tasksService.updateTask(id, title, description, status);
  }

  @Delete('/:id')
  async deleteTaskById(@Param('id') id: string) {
    return this.tasksService.deleteTaskById(id);
  }
}

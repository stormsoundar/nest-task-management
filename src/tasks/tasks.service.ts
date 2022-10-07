import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  getAllTasks = async (
    filterDTO: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> => await this.tasksRepository.getAllTasks(filterDTO, user);

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id, user } });

    if (!task) throw new NotFoundException('Task not found');

    return task;
  }

  createTasks = (createTaskDTO: CreateTaskDTO, user: User): Promise<Task> =>
    this.tasksRepository.createTask(createTaskDTO, user);

  updateTask = async (
    id: string,
    title: string,
    description: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> => {
    const task = await this.getTaskById(id, user);

    if (title) task.title = title;

    if (description) task.description = description;

    if (status) task.status = status;

    await this.tasksRepository.save(task);

    return task;
  };

  async deleteTaskById(id: string, user: User) {
    const result = await this.tasksRepository.delete({ id, user });

    if (result.affected === 0) throw new NotFoundException('Task not found');

    return { message: 'Task deleted successfully' };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}
  // private tasks: Task[] = [];

  getAllTasks = async (filterDTO: GetTasksFilterDto): Promise<Task[]> =>
    await this.tasksRepository.getAllTasks(filterDTO);

  // getTasksWithFilters = (filterDTO: GetTasksFilterDto): Task[] => {
  //   const { status, search } = filterDTO;

  //   let tasks = this.getAllTasks();

  //   if (status) tasks = tasks.filter((task) => task.status === status);

  //   if (search)
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search))
  //         return true;
  //       else return false;
  //     });

  //   return tasks;
  // };

  async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne(id);

    if (!task) throw new NotFoundException('Task not found');

    return task;
  }

  createTasks = (createTaskDTO: CreateTaskDTO): Promise<Task> =>
    this.tasksRepository.createTask(createTaskDTO);

  updateTask = async (
    id: string,
    title: string,
    description: string,
    status: TaskStatus,
  ): Promise<Task> => {
    const task = await this.getTaskById(id);

    if (title) task.title = title;

    if (description) task.description = description;

    if (status) task.status = status;

    await this.tasksRepository.save(task);

    return task;
  };

  async deleteTaskById(id: string) {
    const result = await this.tasksRepository.delete(id);

    if (result.affected === 0) throw new NotFoundException('Task not found');

    return { message: 'Task deleted successfully' };
  }
}

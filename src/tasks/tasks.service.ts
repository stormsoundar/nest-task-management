import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks = (): Task[] => this.tasks;

  getTasksWithFilters = (filterDTO: GetTasksFilterDto): Task[] => {
    const { status, search } = filterDTO;

    let tasks = this.getAllTasks();

    if (status) tasks = tasks.filter((task) => task.status === status);

    if (search)
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search))
          return true;
        else return false;
      });

    return tasks;
  };

  getTaskById = (id: string): Task => this.tasks.find((task) => task.id === id);

  createTasks = (createTaskDTO: CreateTaskDTO): Task => {
    const { title, description } = createTaskDTO;

    const task: Task = {
      id: randomUUID(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  };

  updateTask = (
    id: string,
    title: string,
    description: string,
    status: TaskStatus,
  ) => {
    const task = this.getTaskById(id);

    if (title) task.title = title;

    if (description) task.description = description;

    if (status) task.status = status;

    return task;
  };

  deleteTaskById(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}

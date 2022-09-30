import { Repository, EntityRepository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  getAllTasks = async (filterDTO: GetTasksFilterDto): Promise<Task[]> => {
    const { status, search } = filterDTO;

    const query = this.createQueryBuilder('task');

    if (status) query.andWhere('task.status = :status', { status: status });

    if (search)
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );

    const tasks = await query.getMany();

    return tasks;
  };

  async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    const { title, description } = createTaskDTO;

    const task = await this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);

    return task;
  }
}

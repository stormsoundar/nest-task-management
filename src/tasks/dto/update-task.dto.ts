import { IsEnum } from 'class-validator';
import { TaskStatus } from '../tasks.model';

export class UpdateTaskDTO {
  title: string;
  description: string;
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

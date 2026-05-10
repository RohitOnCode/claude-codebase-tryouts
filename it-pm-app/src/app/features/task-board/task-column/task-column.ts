import { Component, input } from '@angular/core';
import { Task, TaskStatus } from '../../../core/models';
import { TaskCard } from '../task-card/task-card';

const COLUMN_CONFIG: Record<TaskStatus, { label: string; color: string; dot: string }> = {
  'todo': { label: 'To Do', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  'review': { label: 'In Review', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  'done': { label: 'Done', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
};

@Component({
  selector: 'app-task-column',
  imports: [TaskCard],
  templateUrl: './task-column.html',
  styleUrl: './task-column.css'
})
export class TaskColumn {
  status = input.required<TaskStatus>();
  tasks = input.required<Task[]>();

  get config() { return COLUMN_CONFIG[this.status()]; }
  totalPoints = () => this.tasks().reduce((sum, t) => sum + t.storyPoints, 0);
}

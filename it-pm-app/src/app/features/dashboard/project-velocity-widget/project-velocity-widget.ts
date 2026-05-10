import { Component, computed, inject } from '@angular/core';
import { ProjectService } from '../../../core/services/project.service';
import { TaskService } from '../../../core/services/task.service';

interface SprintVelocity {
  sprintName: string;
  projectName: string;
  endDate: string;
  points: number;
}

@Component({
  selector: 'app-project-velocity-widget',
  imports: [],
  templateUrl: './project-velocity-widget.html',
  styleUrl: './project-velocity-widget.css'
})
export class ProjectVelocityWidget {
  private projectSvc = inject(ProjectService);
  private taskSvc = inject(TaskService);

  velocityData = computed<SprintVelocity[]>(() => {
    const projects = this.projectSvc.projects();
    const tasks = this.taskSvc.tasks();
    const result: SprintVelocity[] = [];

    for (const project of projects) {
      for (const sprint of project.sprints) {
        if (!sprint.isActive) {
          const points = tasks
            .filter(t => t.sprintId === sprint.id && t.status === 'done')
            .reduce((sum, t) => sum + t.storyPoints, 0);
          result.push({
            sprintName: sprint.name,
            projectName: project.name,
            endDate: sprint.endDate,
            points,
          });
        }
      }
    }

    return result.sort((a, b) => a.endDate.localeCompare(b.endDate)).slice(-8);
  });

  stats = computed(() => {
    const data = this.velocityData();
    if (!data.length) return { current: 0, average: 0, trend: 0 };
    const points = data.map(d => d.points);
    const current = points[points.length - 1];
    const average = Math.round(points.reduce((s, p) => s + p, 0) / points.length);
    const prev = points.length > 1 ? points[points.length - 2] : current;
    const trend = prev ? Math.round(((current - prev) / prev) * 100) : 0;
    return { current, average, trend };
  });

  maxPoints = computed(() => Math.max(...this.velocityData().map(d => d.points), 1));

  latestSprint = computed<SprintVelocity | undefined>(() => {
    const data = this.velocityData();
    return data.length ? data[data.length - 1] : undefined;
  });

  barHeight(points: number): number {
    return Math.round((points / this.maxPoints()) * 100);
  }

  mathAbs(n: number): number {
    return Math.abs(n);
  }
}

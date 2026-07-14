import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-task-stats',
  imports: [CommonModule, MatProgressBarModule, MatCardModule],
  templateUrl: './task-stats.html',
  styleUrl: './task-stats.scss',
  standalone: true,
})
export class TaskStats {
  private taskService = inject(TaskService);
  stats = this.taskService.stats;
}

import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-filters',
  imports: [],
  templateUrl: './task-filters.html',
  styleUrl: './task-filters.scss',
  standalone: true
})
export class TaskFilters {
  private taskService=inject(TaskService);
}

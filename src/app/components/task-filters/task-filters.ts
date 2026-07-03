import { Component, computed, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskPriority, TaskStatus } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-task-filters',
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './task-filters.html',
  styleUrl: './task-filters.scss',
  standalone: true
})
export class TaskFilters {
  private taskService=inject(TaskService);
  priorities:(TaskPriority | 'Todas')[] = ['Todas', 'Baixa', 'Média', 'Alta'];
  statuses: (TaskStatus | 'Todos')[] = ['Todos', 'Pendente', 'Concluída'];

  search = computed(() => this.taskService.filters().search);
  priority = computed(() => this.taskService.filters().priority);
  status = computed(() => this.taskService.filters().status);

  updateSearch(value: string) {
    this.taskService.updateFilter({ search: value });
  }

  updatePriority(value: TaskPriority | 'Todas') {
    this.taskService.updateFilter({ priority: value });
  }

  updateStatus(value: TaskStatus) {
    this.taskService.updateFilter({ status: value });
  }
  reset(){
    this.taskService.resetfilters();
  }
}

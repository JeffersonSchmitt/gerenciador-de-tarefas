import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TaskItem } from '../task-item/task-item';
import { TaskService } from '../../services/task.service';
import { TaskPriority } from '../../models/task.model';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TaskItem,
    MatSelectModule,
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  private taskService = inject(TaskService);
  taskInput = viewChild<ElementRef<HTMLInputElement>>('taskInput');
  newTaskTitle = signal('');
  newTaskPriority = signal<TaskPriority>('Média');
  priorities: TaskPriority[] = ['Alta', 'Média', 'Baixa'];

  addTask() {
    if (this.newTaskTitle()) {
      this.taskService.addTask(this.newTaskTitle(), this.newTaskPriority());
      this.newTaskTitle.set('');
      this.taskInput()?.nativeElement.focus();
    }
  }

  getAllTasks() {
    return this.taskService.filtredTasks();
  }

  toggleTaskStatus(id: string) {
    this.taskService.toggleTaskStatus(id);
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id);
  }
}

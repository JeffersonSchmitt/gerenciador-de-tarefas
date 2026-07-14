import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  imports: [CommonModule, MatCardModule, MatCheckboxModule, MatIconModule, MatChipsModule],
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
  standalone: true,
})
export class TaskItem {
  task = input.required<Task>();
  toggle = output<void>();
  delete = output<void>();
}

import { Component, signal } from '@angular/core';
import { TaskFilters } from './components/task-filters/task-filters';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { TaskList } from './components/task-list/task-list';
import { TaskStats } from './components/task-stats/task-stats';

@Component({
  selector: 'app-root',
  imports: [CommonModule, TaskFilters, MatIcon, MatToolbar, TaskList, TaskStats],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('gerenciador-de-tarefas');
}

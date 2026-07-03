import { Component, signal } from '@angular/core';
import { TaskFilters } from './components/task-filters/task-filters';
import { MatIcon } from "@angular/material/icon";
import { MatToolbar } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, TaskFilters, MatIcon,MatToolbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('gerenciador-de-tarefas');
}

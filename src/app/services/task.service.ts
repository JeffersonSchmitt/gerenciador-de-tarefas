import { computed, effect, Injectable, signal } from '@angular/core';
import { Task, TaskFilters, TaskPriority } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private taskSignal = signal<Task[]>(this.loadFromLocalStore());

  constructor() {
    effect(() => {
      localStorage.setItem('smart-tasks', JSON.stringify(this.taskSignal()));
    });
  }

  tasks = this.taskSignal.asReadonly();

  filters = signal<TaskFilters>({
    search: '',
    status: 'Todos',
    priority: 'Todas',
  });

  filtredTasks = computed(() => {
    const tasks = this.taskSignal();
    const { search, status, priority } = this.filters();
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'Todos' || task.status === status;
      const matchesPriority = priority === 'Todas' || task.priority === priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  });

  stats = computed(() => {
    const tasks = this.taskSignal();
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === 'Concluída').length;
    const progress = total === 0 ? 0 : (completed / total) * 100;
    return { total, completed, progress };
  });

  addTask(title: string, priority: TaskPriority): void {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status: 'Pendente',
      priority,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: '',
    };
    this.taskSignal.update((tasks) => [...tasks, newTask]);
  }

  toggleTaskStatus(id: string) {
    this.taskSignal.update((tasks) =>
      tasks.map((task) =>
        task.id === id
          ? { ...task, status: task.status === 'Pendente' ? 'Concluída' : 'Pendente' }
          : task,
      ),
    );
  }

  deleteTask(id: string) {
    this.taskSignal.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  updateFilter(partialFilter: Partial<TaskFilters>) {
    this.filters.update((filter) => ({ ...filter, ...partialFilter }));
  }

  updateTask(id: string, updates: Partial<Task>) {
    this.taskSignal.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task)),
    );
  }

  resetfilters() {
    this.filters.set({
      search: '',
      status: 'Todos',
      priority: 'Todas',
    });
  }

  private loadFromLocalStore(): Task[] {
    try {
      const tasks = localStorage.getItem('smart-tasks');
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Error loading tasks from local storage:', error);
      return [];
    }
  }
}

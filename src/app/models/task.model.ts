export type TaskPriority = 'Baixa' | 'Média' | 'Alta';
export type TaskStatus = 'Pendente' | 'Concluída';
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}
export interface TaskFilters{
  search: string;
  priority: TaskPriority | 'Todas';
  status: TaskStatus | 'Todos';
}

## **Signals e Reatividade (signal, computed, effect, inject)**

Este projeto usa o sistema de reatividade baseado em *signals* do Angular para gerenciar estado local e compartilhado de forma simples e previsível. Abaixo está uma explicação prática — pensada para quem está começando — mostrando o que cada primitive faz, quando e onde usá-las no projeto, e exemplos extraídos do código.

- **O que é `signal`?**: um container reativo que guarda um valor. Você cria com `signal(valorInicial)`. Para ler, chame `minhaSignal()`; para alterar, use `set`, `update` ou `mutate`.
	- Uso no projeto: o serviço `TaskService` define o estado central de tarefas com `signal` em [src/app/services/task.service.ts](src/app/services/task.service.ts#L1-L200) (procure por `taskSignal`).
	- Quando usar: para estado mutável que precisa ser reativo — listas, filtros, campos de formulário locais.

- **O que é `computed`?**: é um valor derivado que recalcula automaticamente quando as signals que ele lê mudam. Crie com `computed(() => /* expressão */)` e leia com `meuComputed()`.
	- Uso no projeto: `filtredTasks` e `stats` em [src/app/services/task.service.ts](src/app/services/task.service.ts#L1-L200) são `computed` que derivam a lista filtrada e estatísticas a partir das tasks.
	- Quando usar: sempre que você precisar de um valor derivado (ex.: filtros aplicados, totais, porcentagens) para evitar recalcular manualmente e manter a lógica centralizada.

- **O que é `effect`?**: executa efeitos colaterais quando signals/computeds lidos por ele mudam. Use para persistência, logs, chamadas de API e integrações com o lado de fora do sistema reativo.
	- Uso no projeto: persiste as tasks no `localStorage` com um `effect` dentro de `TaskService` — veja [src/app/services/task.service.ts](src/app/services/task.service.ts#L1-L200) (procure por `effect`).
	- Quando usar: somente para operações que saem do sistema reativo (I/O, armazenamento, comunicação externa). Efeitos não devem retornar valores para lógica de negócio.

- **O que é `inject`?**: atalho de injeção de dependência que funciona em componentes/serviços standalone e classes gerenciadas pelo Angular. Em vez de usar construtores, você pode usar `inject(MinhaClasse)` para obter a instância.
	- Uso no projeto: componentes standalone (ex.: [src/app/components/task-list/task-list.ts](src/app/components/task-list/task-list.ts#L1-L200), [src/app/components/task-filters/task-filters.ts](src/app/components/task-filters/task-filters.ts#L1-L200), [src/app/components/task-stats/task-stats.ts](src/app/components/task-stats/task-stats.ts#L1-L200)) usam `inject(TaskService)` para acessar o serviço central.
	- Quando usar: em componentes/services standalone ou quando preferir evitar boilerplate no construtor. É especialmente conveniente em componentes com `standalone: true`.

Como estes elementos se comunicam neste projeto
- Estado compartilhado: o `TaskService` centraliza o estado das tarefas com uma `signal` interna (`taskSignal`) e expõe sinais e computeds legíveis por outros consumidores. Consulte [src/app/services/task.service.ts](src/app/services/task.service.ts#L1-L200).
- Leitura por componentes: componentes obtêm o `TaskService` via `inject(TaskService)` e então leem `filtredTasks()`, `stats()` ou `tasks()` conforme necessário — por exemplo, `TaskList` chama `this.taskService.filtredTasks()` para renderizar a lista filtrada ([src/app/components/task-list/task-list.ts](src/app/components/task-list/task-list.ts#L1-L200)).
- Estado local em componentes: componentes podem ter signals locais para controlar UI temporária — ex.: `newTaskTitle = signal('')` em [src/app/components/task-list/task-list.ts](src/app/components/task-list/task-list.ts#L1-L200).
- Persistência automática: o `effect` em `TaskService` observa `taskSignal` e grava no `localStorage` sempre que a lista muda. Assim, a persistência fica desacoplada da lógica de atualização de estado.

Por que usar esta abordagem?
- Simplicidade: `signal` + `computed` tornam explícito o que é estado e o que é derivado, evitando estados redundantes e sincronizações manuais.
- Performance: computeds já sabem quando precisam recalcular; o sistema evita trabalho desnecessário quando nada mudou.
- Testabilidade: lógica pura (adicionar, atualizar, filtrar) vive no serviço — fácil de testar isoladamente.
- Desacoplamento: `effect` é o único ponto que lida com I/O; o restante do código manipula apenas valores.

Boas práticas observadas no projeto
- Centralize estado compartilhado em serviços e exponha `asReadonly()` quando não quiser que consumidores modifiquem diretamente (veja `tasks = this.taskSignal.asReadonly()` em [src/app/services/task.service.ts](src/app/services/task.service.ts#L1-L200)).
- Use `computed` para todo valor derivado; evite duplicar lógica de filtro/contagem em múltiplos componentes.
- Use `effect` apenas para efeitos colaterais (persistência, logs, notificações). Não coloque lógica de negócio complexa dentro de `effect`.
- Prefira `inject` em componentes standalone para código mais conciso e legível.

Exemplos rápidos retirados do código
- Criar signal (estado de tarefas): veja `taskSignal` em [src/app/services/task.service.ts](src/app/services/task.service.ts#L1-L200).

```ts
// leitura
const all = this.taskSignal();

// atualização (adicionar)
this.taskSignal.update(tasks => [...tasks, newTask]);

// expor leitura segura
this.tasks = this.taskSignal.asReadonly();
```

- Computed (lista filtrada / estatísticas): veja `filtredTasks` e `stats` em [src/app/services/task.service.ts](src/app/services/task.service.ts#L1-L200).

```ts
const filtered = computed(() => {
	const tasks = this.taskSignal();
	// aplicar filtros...
	return tasks.filter(...);
});

const stats = computed(() => {
	const tasks = this.taskSignal();
	return { total: tasks.length, completed: ... };
});
```

- Effect (persistir automatizado): veja `effect` no construtor de `TaskService`.

```ts
effect(() => {
	localStorage.setItem('smart-tasks', JSON.stringify(this.taskSignal()));
});
```

- `inject` em componente standalone (acesso ao serviço): exemplo em [src/app/components/task-filters/task-filters.ts](src/app/components/task-filters/task-filters.ts#L1-L200).

```ts
private taskService = inject(TaskService);
const search = computed(() => this.taskService.filters().search);
```

import {State, Action, StateContext, Selector} from '@ngxs/store';
import {Todo} from '../models/Todo';
import {AddTodo, DeleteTodo, GetTodos, SetSelectedTodo, UpdateTodo} from '../actions/todo.action';
import {TodoService} from '../todo.service';
import {tap} from 'rxjs/operators';

export class TodoStateModel {
  todos: Todo[];
  selectedTodo: Todo;
}

@State<TodoStateModel>({
  name: 'todos',
  defaults: {
    todos: [],
    selectedTodo: null
  }
})
export class TodoState {

  constructor(private todoService: TodoService) {
  }

  @Selector()
  static getTodoList(state: TodoStateModel) {
    console.log('Selector: getTodoList: ', state);
    return state.todos;
  }

  @Selector()
  static getSelectedTodo(state: TodoStateModel) {
    console.log('Selector: getSelectedTodo: ', state);
    return state.selectedTodo;
  }

  @Action(GetTodos)
  getTodos({getState, setState}: StateContext<TodoStateModel>) {
    console.log('ACTIONS: getTodos');
    return this.todoService.fetchTodos().pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        todos: result,
      });
    })).subscribe(() => console.log('ServiceMethod: fetchTodos.sbuscribe'));
  }

  @Action(AddTodo)
  addTodo({getState, patchState}: StateContext<TodoStateModel>, {payload}: AddTodo) {
    console.log('ACTIONS: addTodo');
    return this.todoService.addTodo(payload).pipe(tap((result) => {
      const state = getState();
      patchState({
        todos: [...state.todos, result]
      });
    }));
  }

  @Action(UpdateTodo)
  updateTodo({getState, setState}: StateContext<TodoStateModel>, {payload, id}: UpdateTodo) {
    console.log('ACTIONS: updateTodo');
    return this.todoService.updateTodo(payload, id).pipe(tap((result) => {
      const state = getState();
      const todoList = [...state.todos];
      const todoIndex = todoList.findIndex(item => item.id === id);
      todoList[todoIndex] = result;
      setState({
        ...state,
        todos: todoList,
      });
    }));
  }


  @Action(DeleteTodo)
  deleteTodo({getState, setState}: StateContext<TodoStateModel>, {id}: DeleteTodo) {
    console.log('ACTIONS: deleteTodo');
    return this.todoService.deleteTodo(id).pipe(tap(() => {
      const state = getState();
      const filteredArray = state.todos.filter(item => item.id !== id);
      setState({
        ...state,
        todos: filteredArray,
      });
    }));
  }

  @Action(SetSelectedTodo)
  setSelectedTodoId({getState, setState}: StateContext<TodoStateModel>, {payload}: SetSelectedTodo) {
    console.log('ACTIONS: setSelectedTodoId');
    const state = getState();
    setState({
      ...state,
      selectedTodo: payload
    });
  }
}

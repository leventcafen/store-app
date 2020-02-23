import {Component, OnInit} from '@angular/core';
import {TodoState} from '../states/todo.state';
import {Select, Store} from '@ngxs/store';
import {Todo} from '../models/Todo';
import {Observable} from 'rxjs';
import {DeleteTodo, GetTodos, SetSelectedTodo} from '../actions/todo.action';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Select(TodoState.getTodoList) todos$: Observable<Todo[]>;

  constructor(private store: Store) {
  }

  ngOnInit() {
    console.log('LISTCOMPONENT.ngOninit.GetTodos');
    this.store.dispatch(new GetTodos());
  }

  deleteTodo(id: number) {
    console.log('LISTCOMPONENT.deleteTodo');
    this.store.dispatch(new DeleteTodo(id));
  }

  editTodo(payload: Todo) {
    console.log('LISTCOMPONENT.editTodo.SetSelectedTodo');
    this.store.dispatch(new SetSelectedTodo(payload));
  }

}

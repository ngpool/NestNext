import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    { id: 1, title: 'Learn NestJS', isCompleted: false },
    { id: 2, title: 'Build a React app', isCompleted: false },
  ];

  // Create a new todo
  create(createTodoDto: CreateTodoDto): Todo {
    const newTodo: Todo = {
      id: this.todos.length + 1,
      title: createTodoDto.title,
      isCompleted: false,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  // Get all todos
  findAll(): Todo[] {
    return this.todos;
  }

  // Get a single todo by ID
  findOne(id: number): Todo | null {
    return this.todos.find((todo) => todo.id === id) || null;
  }

  // Update a todo by ID
  update(id: number, updateTodoDto: UpdateTodoDto): Todo | null {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) return null;

    const updatedTodo: Todo = {
      ...this.todos[todoIndex],
      ...updateTodoDto,
    };
    this.todos[todoIndex] = updatedTodo;
    return updatedTodo;
  }

  // Delete a todo by ID
  remove(id: number): Todo | null {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) return null;

    const deletedTodo = this.todos[todoIndex];
    this.todos.splice(todoIndex, 1);
    return deletedTodo;
  }
}

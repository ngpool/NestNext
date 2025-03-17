import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
}

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    { id: 1, title: 'Learn NestJS', isCompleted: false },
    { id: 2, title: 'Build a React app', isCompleted: false },
  ];

  // Create a new todo
  create(createTodoDto: CreateTodoDto) {
    const newTodo: Todo = {
      id: this.todos.length + 1, // 自動採番
      title: createTodoDto.title, // title を DTO から設定
      isCompleted: false,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  // Get all todos
  findAll() {
    return this.todos;
  }

  // Get a single todo by ID
  findOne(id: number) {
    return this.todos.find((todo) => todo.id === id) || null;
  }

  // Update a todo by ID
  update(id: number, updateTodoDto: UpdateTodoDto) {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) return null;

    const updatedTodo = {
      ...this.todos[todoIndex],
      ...updateTodoDto,
    };
    this.todos[todoIndex] = updatedTodo;
    return updatedTodo;
  }

  // Delete a todo by ID
  remove(id: number) {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) return null;

    const deletedTodo = this.todos[todoIndex];
    this.todos.splice(todoIndex, 1);
    return deletedTodo;
  }
}

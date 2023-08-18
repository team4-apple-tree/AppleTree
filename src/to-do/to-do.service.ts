import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '../entity/to-do.entity';
import { CreateToDoDto } from '../dto/to-do/create-todo-dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async getTodo(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  async getTodoById(todoId: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { todoId },
    });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  async createTodo(createTodoDto: CreateToDoDto): Promise<Todo> {
    const newTodo = this.todoRepository.create(createTodoDto);
    return this.todoRepository.save(newTodo);
  }

  async updateTodo(
    todoId: number,
    createTodoDto: CreateToDoDto,
  ): Promise<Todo> {
    const todoToUpdate = await this.todoRepository.findOne({
      where: { todoId },
    });
    if (!todoToUpdate) {
      throw new NotFoundException('Todo not found');
    }

    todoToUpdate.state = createTodoDto.state;

    return this.todoRepository.save(todoToUpdate);
  }

  async deleteTodo(todoId: number): Promise<void> {
    const todoToDelete = await this.todoRepository.findOne({
      where: { todoId },
    });
    if (!todoToDelete) {
      throw new NotFoundException('Todo not found');
    }

    await this.todoRepository.remove(todoToDelete);
  }
}

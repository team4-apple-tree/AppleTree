import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TodoService } from './to-do.service';
import { Todo } from '../entity/to-do.entity';
import { CreateToDoDto } from '../dto/to-do/create-todo-dto';

@Controller('to-do')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('/todo')
  async getTodo(): Promise<Todo[]> {
    return this.todoService.getTodo();
  }

  @Get('/todo/:id')
  async getTodoById(@Param('id') id: number): Promise<Todo> {
    return this.todoService.getTodoById(id);
  }

  @Post('/todo')
  async createTodo(@Body() createTodoDto: CreateToDoDto): Promise<Todo> {
    return this.todoService.createTodo(createTodoDto);
  }

  @Put('/todo/:id')
  async updateTodo(
    @Param('id') id: number,
    @Body() createTodoDto: CreateToDoDto,
  ): Promise<Todo> {
    return this.todoService.updateTodo(+id, createTodoDto); // +id를 사용하여 문자열을 숫자로 변환
  }

  @Delete('/todo/:id')
  async deleteTodo(@Param('id') id: number): Promise<void> {
    return this.todoService.deleteTodo(+id); // +id를 사용하여 문자열을 숫자로 변환
  }
}

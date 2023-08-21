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
import { UpdateToDoDto } from '../dto/to-do/update-todo-dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('/')
  async getTodo(): Promise<Todo[]> {
    return this.todoService.getTodo();
  }

  @Get('/:id')
  async getTodoById(@Param('id') id: number): Promise<Todo> {
    return this.todoService.getTodoById(id);
  }

  @Post('/')
  async createTodo(@Body() createTodoDto: CreateToDoDto): Promise<Todo> {
    return this.todoService.createTodo(createTodoDto);
  }

  @Put('/:id')
  async updateTodo(
    @Param('id') id: number,
    @Body() updateTodoDto: UpdateToDoDto,
  ): Promise<Todo> {
    return this.todoService.updateTodo(+id, updateTodoDto);
  }

  @Delete('/:id')
  async deleteTodo(@Param('id') id: number): Promise<void> {
    return this.todoService.deleteTodo(+id);
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '../entity/to-do.entity';
import { CreateToDoDto } from '../dto/to-do/create-todo-dto';
import { ToDoState } from '../entity/to-do.entity';
import { CreateCardDto } from '../dto/card/create-card-dto';
import { Card } from '../entity/card.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    @InjectRepository(Card) // 카드 엔티티를 주입받기 위한 추가
    private readonly cardRepository: Repository<Card>,
  ) {}

  async getTodo(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  async getTodoById(todoId: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { todoId },
    });
    if (!todo) {
      throw new NotFoundException('Todo가 존재하지 않습니다.');
    }
    return todo;
  }

  async createTodo(createTodoDto: CreateToDoDto): Promise<Todo> {
    const validStates: ToDoState[] = [
      ToDoState.TODO,
      ToDoState.IN_PROGRESS,
      ToDoState.COMPLETED,
    ];

    if (validStates.includes(createTodoDto.state)) {
      const newTodo = this.todoRepository.create(createTodoDto);
      return this.todoRepository.save(newTodo);
    } else {
      throw new BadRequestException('유효하지 않은 상태 값입니다.');
    }
  }

  async updateTodo(
    todoId: number,
    createTodoDto: CreateToDoDto,
  ): Promise<Todo> {
    const todoToUpdate = await this.todoRepository.findOne({
      where: { todoId },
    });
    if (!todoToUpdate) {
      throw new NotFoundException('Todo가 존재하지 않습니다.');
    }

    const validStates: ToDoState[] = [
      ToDoState.TODO,
      ToDoState.IN_PROGRESS,
      ToDoState.COMPLETED,
    ];

    if (validStates.includes(createTodoDto.state)) {
      todoToUpdate.state = createTodoDto.state;
    } else {
      throw new BadRequestException('유효하지 않은 상태 값입니다.');
    }

    return this.todoRepository.save(todoToUpdate);
  }

  async deleteTodo(todoId: number): Promise<void> {
    const todoToDelete = await this.todoRepository.findOne({
      where: { todoId },
    });
    if (!todoToDelete) {
      throw new NotFoundException('Todo가 존재하지 않습니다.');
    }

    await this.todoRepository.softDelete(todoToDelete);
  }

  async createCardInTodo(
    todo: Todo,
    createCardDto: CreateCardDto,
  ): Promise<Card> {
    const newCard = new Card();
    newCard.title = createCardDto.title;
    newCard.desc = createCardDto.desc;
    newCard.toDos = todo; // 연결된 Todo 객체 설정

    return this.cardRepository.save(newCard);
  }
}

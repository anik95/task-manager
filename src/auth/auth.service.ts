import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { UpdateAuthDto } from './dto/update-auth.dto.js';
import { type Database, DRIZZLE } from '../database/database.module.js';
import { hashString } from '../utils/crypt.js';
import { users } from '../database/schema.js';

@Injectable()
export class AuthService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async create(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;
    const userExists = await this.db.query.users.findFirst({
      where: { email: email },
    });
    if (userExists) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await hashString(password);

    const [newUser] = await this.db
      .insert(users)
      .values({
        email: email,
        passwordHash: hashedPassword,
      })
      .returning({
        email: users.email,
        id: users.id,
        role: users.role,
        createdAt: users.createdAt,
      });

    return newUser;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

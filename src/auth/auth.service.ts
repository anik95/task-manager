import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { UpdateAuthDto } from './dto/update-auth.dto.js';
import { type Database, DRIZZLE } from '../database/database.module.js';
import { compareHash, hashString } from '../utils/crypt.js';
import { users } from '../database/schema.js';
import { SignInDto } from './dto/sign-in.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: Database,
    private readonly jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
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

  async signin(signInDto: SignInDto) {
    const { email, password, rememberMe } = signInDto;
    const user = await this.db.query.users.findFirst({
      where: { email: email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await compareHash(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const jwtPayload = { sub: user.id, role: user.role }; //dont use email in payload, since email can be changed by user, and we want to keep the payload consistent. Use id instead, since it is unique and never changes.

    const token = await this.jwtService.signAsync(jwtPayload);
    return { accessToken: token };
  }
}

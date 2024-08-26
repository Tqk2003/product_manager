import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: Repository<User>) {}

  private splitName(name: string): { firstname: string, lastname: string } {
    const nameParts = name.split(' ');
    const firstname = nameParts.shift();
    const lastname = nameParts.join(' ');
    return { firstname, lastname };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const {name,email,phone,username,password} = createUserDto;
    const { firstname, lastname } = this.splitName(name);
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newuser = this.userRepository.create({
      name,
      firstname,
      lastname,
      email,
      phone,
      username,
      password: hashedPassword
    })
    return this.userRepository.save(newuser);
  }

  async login(username: string, password: string): Promise<{accessToken: string}> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('User not found');
    }
    const accessToken = jwt.sign({ id: user.id, username: user.username }, 'secretkey');
    return { accessToken };
  }

  async findAll(): Promise<any[]> {
    const users = await this.userRepository.find();
    return users.map(user => ({
      ...user,
      name: `${user.firstname} ${user.lastname}`
    }))
  }

  async findOne(id: number): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      ...user,
      name: `${user.firstname} ${user.lastname}`
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.userRepository.update(id, updateUserDto);
    const updateUser = await this.userRepository.findOneBy({ id });
    if (!updateUser) {
      throw new NotFoundException('User not found');
    }
    return updateUser;
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}

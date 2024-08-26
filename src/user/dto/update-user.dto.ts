import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    name?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: number;
    username?: string;
    password?: string;
}

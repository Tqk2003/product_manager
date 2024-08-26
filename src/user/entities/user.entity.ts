import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @Column()
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    lastname: string;

    @Column()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Column()
    @IsNumber()
    @IsNotEmpty()
    phone: number;

    @Column()
    @IsString()
    @IsNotEmpty()
    username: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    password: string;
}

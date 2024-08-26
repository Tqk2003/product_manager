import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => Category, (category) => category.products, {eager: true})
    category: Category;

    @Column('decimal',{precision: 10, scale: 2})
    price: number;

}

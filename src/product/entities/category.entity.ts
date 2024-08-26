import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    category: string;

    @Column({unique: true}) 
    slug: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[]
}
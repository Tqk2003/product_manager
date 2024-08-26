import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  private generateSlug(category: string): string {
    return category.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }

  private formatPrice(product: Product): any {
    return{
      ...product,
      price: `${product.price} $` 
    }
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    let category = await this.categoryRepository.findOne({ where: {category: createProductDto.category} });

    if (!category) {
      category = this.categoryRepository.create({
        category: createProductDto.category,
        slug: this.generateSlug(createProductDto.category)
      });
      await this.categoryRepository.save(category);
    }

    const product = this.productRepository.create({
      ...createProductDto,
      category
    });
    return this.productRepository.save(product);
  }

  async findAll(sortBy: string, sortOrder: 'ASC' | 'DESC'): Promise<Product[]> {
    const validSortOrders: ('ASC' | 'DESC')[] = ['ASC', 'DESC'];
    const validFields: string[] = ['name', 'price', 'createdAt']; // Adjust this list based on your actual entity fields

    if (!validSortOrders.includes(sortOrder)) {
      throw new Error('Invalid sort order');
    }
    if (!validFields.includes(sortBy)) {
      throw new Error('Invalid sort field');
    }
    const products = await this.productRepository.find({
      order: {
        [sortBy]: sortOrder,
      },
      relations: ['category'],
    });

    return products.map(product => this.formatPrice(product));
  }

  async findOne(id: number): Promise<Product> {
    const findproduct = await this.productRepository.findOneBy({ id });
    if (!findproduct) {
      throw new NotFoundException('Product not found');
    }

    return this.formatPrice(findproduct);
  }

  async search(name: string, category: string): Promise<Product[]> {
    const querybuilder = this.productRepository.createQueryBuilder('product');

    if (name) {
      querybuilder.andWhere('product.name LIKE :name', { name: `%${name}%` });
    }
    if (category) {
      const categoryEntity = await this.categoryRepository.findOne({where: { category }});
      if (categoryEntity) {
        querybuilder.andWhere('product.category = :category', { category: categoryEntity.id });
      } else {
        return [];
      }
    }

    const products = await querybuilder.getMany();
    if (products.length === 0) {
      throw new NotFoundException('Product not found');
    }
    return products.map(product => this.formatPrice(product));
  }

  async findCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findByCategory(categoryName: string): Promise<Product[]> {
    const category = await this.categoryRepository.findOne({ where: {category: categoryName} });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const products = await this.productRepository.find({
      where: {category: category}, 
    })
    return products
  }

  async getCategoryList(): Promise<string[]> {
    const result = await this.categoryRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .getRawMany();

    return result.map(row => row.category); 
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({where: {id}, relations: ['category']});

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let category = await this.categoryRepository.findOne({ where: {category: updateProductDto.category} });

    if (!category) {
      category = this.categoryRepository.create({
        category: updateProductDto.category,
        slug: this.generateSlug(updateProductDto.category)
      });
      await this.categoryRepository.save(category);
    }

    this.productRepository.merge(product, {
      ...updateProductDto,
      category
    })

    const updatedProduct = await this.productRepository.save(product);
    return this.formatPrice(updatedProduct);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Product not found');
    }
  }
}

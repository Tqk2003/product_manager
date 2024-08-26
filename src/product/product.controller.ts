import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('add')
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query('sortBy') sortBy: string = 'name',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<Product[]> {
    return this.productService.findAll(sortBy, sortOrder);
  }

  @Get('find/:id')
  async findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Get('search')
  async search(
    @Query('name') name: string,
    @Query('category') category: string,
  ): Promise<Product[]> {
    return this.productService.search(name, category);
  }

  @Get('categories')
  async findCategories(): Promise<Category[]> {
    return this.productService.findCategories();
  }

  @Get('category/:categoryName')
  async getCategory(@Param('categoryName') categoryName: string): Promise<Product[]> {
    return this.productService.findByCategory(categoryName);
  }

  @Get('categoryList')
  async getCategoryList(): Promise<string[]> {
    return this.productService.getCategoryList();
  }
  
  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.productService.remove(id);
  }
}

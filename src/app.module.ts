import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product/entities/product.entity';
import { Category } from './product/entities/category.entity';
//import { UserModule } from './user/user.module';
//import { User } from './user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'trankhai',
      password: 'hutbuoi20',
      database: 'shop',
      entities: [Product,Category], //User],
      synchronize: true,
      driver: require('mysql2'), 
    }),
    ProductModule,
    //UserModule,
  ],
  controllers: [],
  providers: [ProductModule,] //UserModule],
})
export class AppModule {}

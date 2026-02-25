import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Product } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getExternalProducts() {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://fakestoreapi.com/products')
      );
  
      return response.data;
    } catch (error) {
      throw new BadRequestException('Failed to fetch external products');
    }
  }

  async syncProducts() {
    const externalProducts = await this.getExternalProducts();

    let createdCount = 0;

    for (const item of externalProducts) {
      const exists = await this.productRepository.findOne({
        where: { externalId: item.id },
      });

      if (!exists) {
        const product = this.productRepository.create({
          externalId: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          image: item.image,
          category: item.category,
        });

        await this.productRepository.save(product);
        createdCount++;
      }
    }

    return {
      message: 'Sync completed',
      created: createdCount,
    };
  }

  async getAllProducts(
    page: number = 1,
    limit: number = 5,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
  ) {
    const query = this.productRepository.createQueryBuilder('product');
  
    if (category) {
      query.andWhere('product.category = :category', { category });
    }
  
    if (minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }
  
    if (maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }
  
    query.skip((page - 1) * limit);
    query.take(limit);
    query.orderBy('product.id', 'ASC');
  
    const [data, total] = await query.getManyAndCount();
  
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getProductById(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });
  
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  
    return product;
  }
    
  async createProduct(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      return await this.productRepository.save(product);
    } catch (error) {
      throw new BadRequestException('Error creating product');
    }
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id },
    });
  
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  
    Object.assign(product, updateProductDto);
  
    return this.productRepository.save(product);
  }

  async deleteProduct(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });
  
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  
    await this.productRepository.remove(product);
  
    return {
      message: `Product with id ${id} deleted successfully`,
    };
  }
}
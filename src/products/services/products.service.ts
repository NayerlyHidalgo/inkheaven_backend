import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Product | null> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findByCategory(category: string): Promise<Product[]> {
    return await this.productRepository.find({ where: { category } });
  }

  async findByStyle(style: string): Promise<Product[]> {
    return await this.productRepository.find({ 
      where: { style },
      order: { createdAt: 'DESC' },
    });
  }

  async findPublished(): Promise<Product[]> {
    return await this.productRepository.find({ where: { status: 'published' } });
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .where('product.price >= :minPrice AND product.price <= :maxPrice', { minPrice, maxPrice })
      .orderBy('product.price', 'ASC')
      .getMany();
  }

  async searchByName(name: string): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .where('product.name ILIKE :name', { name: `%${name}%` })
      .orderBy('product.createdAt', 'DESC')
      .getMany();
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product | null> {
    const product = await this.findOne(id); // This will throw if not found
    await this.productRepository.update(id, updateProductDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id); // This will throw if not found
    await this.productRepository.delete(id);
  }
}

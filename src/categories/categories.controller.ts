import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  ParseBoolPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ReorderCategoriesDto } from './dto/reorder-categories.dto';
import { Category } from './schemas/category.schema'; // Importa el schema, no la entidad
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('categories')
export class CategoriesController {
  categoryModel: any;
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  // Esta ruta debe ir antes de las rutas con parámetro para evitar conflictos
  @Get('active')
  async findAllActive(): Promise<Category[]> {
    return this.categoriesService.findAllActive();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getStats() {
    return this.categoriesService.getStats();
  }

  @Get()
  async findAll(includeInactive = false): Promise<Category[]> {
    const filter = includeInactive ? {} : { activa: true };
    return await this.categoryModel.find(filter).sort({ orden: 1, name: 1 }).exec();
  }


  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<Category | null> {
    const category = await this.categoriesService.findByName(name);
    if (!category) {
      // Opcional: puedes lanzar excepción si prefieres
      // throw new NotFoundException(`Categoría con nombre ${name} no encontrada`);
    }
    return category;
  }


  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async reorder(@Body() reorderDto: ReorderCategoriesDto): Promise<Category[]> {
    return this.categoriesService.reorder(reorderDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async toggleActive(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.toggleActive(id);
  }

  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async activate(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.activate(id);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deactivate(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(id);
  }
}

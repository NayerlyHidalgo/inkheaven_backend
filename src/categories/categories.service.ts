import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ReorderCategoriesDto } from './dto/reorder-categories.dto';

@Injectable()
export class CategoriesService {
  activate(id: string): Category | PromiseLike<Category> {
    throw new Error('Method not implemented.');
  }
  deactivate(id: string): Category | PromiseLike<Category> {
    throw new Error('Method not implemented.');
  }
  toggleActive(id: string): Category | PromiseLike<Category> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  private mapDocToCategory(doc: CategoryDocument): Category {
  return {
    id: (doc._id as any).toString(),  // <-- casteo explícito a string
    name: doc.name,
    description: doc.description,
    icono: doc.icono,
    activa: doc.activa,
    orden: doc.orden,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const existingCategory = await this.categoryModel.findOne({
        name: createCategoryDto.name,
      });

      if (existingCategory) {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }

      const categoryData = {
        name: createCategoryDto.name,
        description: createCategoryDto.description || '',
        icono: createCategoryDto.icono || '📁',
        activa: createCategoryDto.activa !== undefined ? createCategoryDto.activa : true,
        orden: createCategoryDto.orden || 0,
      };

      const createdCategory = new this.categoryModel(categoryData);
      const savedCategory = await createdCategory.save();

      console.log('✅ Categoría creada exitosamente:', savedCategory.name);
      return this.mapDocToCategory(savedCategory);
    } catch (error) {
      console.error('❌ Error al crear categoría:', error);

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new Error(`Error al crear la categoría: ${error.message}`);
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      const categories = await this.categoryModel
        .find({ activa: true })
        .sort({ orden: 1, name: 1 })
        .exec();

      console.log(`📋 Encontradas ${categories.length} categorías activas`);
      return categories.map(this.mapDocToCategory);
    } catch (error) {
      console.error('❌ Error al obtener categorías:', error);
      throw new Error(`Error al obtener las categorías: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<Category> {
    try {
      const category = await this.categoryModel.findById(id).exec();

      if (!category) {
        throw new NotFoundException(`No se encontró la categoría con ID: ${id}`);
      }

      return this.mapDocToCategory(category);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('❌ Error al buscar categoría:', error);
      throw new Error(`Error al buscar la categoría: ${error.message}`);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    try {
      if (updateCategoryDto.name) {
        const existingCategory = await this.categoryModel.findOne({
          name: updateCategoryDto.name,
          _id: { $ne: id },
        });

        if (existingCategory) {
          throw new ConflictException('Ya existe una categoría con ese nombre');
        }
      }

      const updatedCategory = await this.categoryModel
        .findByIdAndUpdate(id, updateCategoryDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedCategory) {
        throw new NotFoundException(`No se encontró la categoría con ID: ${id}`);
      }

      console.log('✅ Categoría actualizada exitosamente:', updatedCategory.name);
      return this.mapDocToCategory(updatedCategory);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }

      console.error('❌ Error al actualizar categoría:', error);
      throw new Error(`Error al actualizar la categoría: ${error.message}`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.categoryModel.findByIdAndDelete(id).exec();

      if (!result) {
        throw new NotFoundException(`No se encontró la categoría con ID: ${id}`);
      }

      console.log('✅ Categoría eliminada exitosamente:', result.name);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('❌ Error al eliminar categoría:', error);
      throw new Error(`Error al eliminar la categoría: ${error.message}`);
    }
  }

  async reactivate(id: string): Promise<Category> {
    try {
      const category = await this.categoryModel
        .findByIdAndUpdate(id, { activa: true }, { new: true })
        .exec();

      if (!category) {
        throw new NotFoundException(`No se encontró la categoría con ID: ${id}`);
      }

      console.log('✅ Categoría reactivada exitosamente:', category.name);
      return this.mapDocToCategory(category);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('❌ Error al reactivar categoría:', error);
      throw new Error(`Error al reactivar la categoría: ${error.message}`);
    }
  }

  async findByName(name: string): Promise<Category | null> {
    try {
      const category = await this.categoryModel.findOne({ name }).exec();
      return category ? this.mapDocToCategory(category) : null;
    } catch (error) {
      console.error('❌ Error al buscar categoría por nombre:', error);
      return null;
    }
  }

  async searchCategories(searchTerm: string): Promise<Category[]> {
    try {
      const categories = await this.categoryModel
        .find({
          activa: true,
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
          ],
        })
        .sort({ orden: 1, name: 1 })
        .exec();

      console.log(`🔍 Encontradas ${categories.length} categorías que coinciden con: "${searchTerm}"`);
      return categories.map(this.mapDocToCategory);
    } catch (error) {
      console.error('❌ Error al buscar categorías:', error);
      throw new Error(`Error al buscar categorías: ${error.message}`);
    }
  }

  async getStats(): Promise<{ total: number; activas: number; inactivas: number }> {
    try {
      const total = await this.categoryModel.countDocuments();
      const activas = await this.categoryModel.countDocuments({ activa: true });
      const inactivas = total - activas;

      return { total, activas, inactivas };
    } catch (error) {
      console.error('❌ Error al obtener estadísticas:', error);
      return { total: 0, activas: 0, inactivas: 0 };
    }
  }

  // Puedes implementar el reorder y findAllActive si quieres
  async reorder(reorderDto: ReorderCategoriesDto): Promise<Category[]> {
    // Implementar lógica de reordenamiento según reorderDto
    throw new Error('Method not implemented.');
  }

  async findAllActive(): Promise<Category[]> {
    // Implementar si lo necesitas
    throw new Error('Method not implemented.');
  }
}

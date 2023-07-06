import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from './entities/category.entity'
import { Repository } from 'typeorm'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(Category)
		private readonly categoryRepository: Repository<Category>,
	) {}

	async create(createCategoryDto: CreateCategoryDto, id: number) {
		const isExist = await this.categoryRepository.findBy({
			user: { id },
			title: createCategoryDto.title,
		})
		
		if (isExist.length)
			throw new BadRequestException('Категория уже существует')

		const newCategory = {
			title: createCategoryDto.title,
			user: { id },
		}
		return await this.categoryRepository.save(newCategory)
	}

	async findAll(id: number) {
		return await this.categoryRepository.find({
			where: {
				user: { id },
			},
			relations: {
				transactions: true,
			},
		})
	}

	async findOne(id: number) {
		const category = await this.categoryRepository.findOne({
			where: {
				id,
			},
			relations: {
				transactions: true,
				user: true,
			},
		})

		if (!category) throw new NotFoundException('Категория не найдена')

		return category
	}

	async update(updateCategoryDto: UpdateCategoryDto, id: number) {
		const category = await this.categoryRepository.findOne({
			where: { id },
		})

		if (!category) throw new NotFoundException('Категория не найдена')

		return await this.categoryRepository.update(id, updateCategoryDto)
	}

	async remove(id: number) {
		const category = await this.categoryRepository.findOne({ where: { id } })

		if (!category) throw new NotFoundException('Категория не найдена')
		
		return await this.categoryRepository.delete(id)
	}
}

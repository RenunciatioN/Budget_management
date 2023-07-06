import {
	Controller,
	Get,
	Post,
	Body,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
	Param,
	Patch,
	Delete,
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { AuthorGuard } from 'src/guard/author.guard'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	create(@Body() createCategoryDto: CreateCategoryDto, @Req() req) {
		return this.categoryService.create(createCategoryDto, +req.user.id)
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	findAll(@Req() req) {
		return this.categoryService.findAll(+req.user.id)
	}

	@Get(':type/:id')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	findOne(@Param('id') id: string) {
		return this.categoryService.findOne(+id)
	}

	@Patch(':type/:id')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	update(
		@Body() updateCategoryDto: UpdateCategoryDto,
		@Param('id') id: string,
	) {
		return this.categoryService.update(updateCategoryDto, +id)
	}

	@Delete(':type/:id')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	remove(@Param('id') id: string) {
		return this.categoryService.remove(+id)
	}
}

import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto, UpdateContentDto, ContentQueryDto } from './dto/content.dto';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  async create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @Get()
  async findAll(@Query() query: ContentQueryDto) {
    return this.contentService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.update(id, updateContentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }

  @Post(':id/publish')
  async publish(@Param('id') id: string) {
    return this.contentService.publish(id);
  }

  @Get('search/:query')
  async search(@Param('query') query: string) {
    return this.contentService.search(query);
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: string) {
    return this.contentService.findByCategory(category);
  }

  @Get('tag/:tag')
  async findByTag(@Param('tag') tag: string) {
    return this.contentService.findByTag(tag);
  }
}
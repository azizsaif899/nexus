import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/v2/documents')
export class DocumentController {
  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  async analyzeDocument(@UploadedFile() file: Express.Multer.File, @Body('query') query?: string) {
    return {
      success: true,
      analysis: `تحليل الملف: ${file.originalname}`,
      query: query || 'تحليل عام',
      fileSize: file.size,
      mimeType: file.mimetype
    };
  }

  @Post('analyze-url')
  async analyzeUrl(@Body('url') url: string, @Body('query') query?: string) {
    return {
      success: true,
      analysis: `تحليل الرابط: ${url}`,
      query: query || 'تحليل عام'
    };
  }
}

import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    ConflictException,
    HttpException,
  } from '@nestjs/common';
  
  @Catch(ConflictException, HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: ConflictException | HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();

  
      const status = exception instanceof HttpException ? exception.getStatus() : 500;
      const message = exception.message || 'Internal server error';
  
      // ساخت پاسخ سفارشی برای خطا
      const errorResponse = {
        statusCode: status,
        message: message,
      };
  
      console.error('HttpException:', errorResponse);
  
      // ارسال پاسخ به کلاینت
     return {error:errorResponse}
    }
  }
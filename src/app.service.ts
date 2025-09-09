import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getXinchao():string {
    return 'xin chào viet nam'
  }
}
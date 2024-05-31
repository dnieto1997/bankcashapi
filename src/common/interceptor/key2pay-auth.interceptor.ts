import { HttpService } from '@nestjs/axios';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, switchMap } from 'rxjs';
import { Key2payAuthService } from '../services/key2pay-auth.service';

@Injectable()
export class Key2payAuthInterceptor implements NestInterceptor {
  constructor(
    private readonly httpService: HttpService,
    private readonly key2payAuthService: Key2payAuthService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    if (!this.key2payAuthService.isTokenValid()) {
      const token = await this.key2payAuthService.getToken();

      this.httpService.axiosRef.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;
      return next.handle(); // Aquí se devuelve el observable del siguiente manejador
    } else {
      const token = this.key2payAuthService.token;

      this.httpService.axiosRef.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;

      return next.handle();
    }
  }
}

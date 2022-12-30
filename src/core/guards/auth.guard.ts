import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

const STATIC_TOKEN = '5mhBHqs5_DTLdINd9p5m7ZJ6XD0Xc55kIaCRY5r6HRA';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken =
      request.headers['authorization'] || request.headers['Authorization'];
    const token = bearerToken?.replace('Bearer ', '');
    if (token === STATIC_TOKEN) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'supersecretkey', // después lo movemos a .env
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [ AuthService, 
               JwtStrategy, 
               RolesGuard
          ],
  controllers: [AuthController],
})
export class AuthModule {} 
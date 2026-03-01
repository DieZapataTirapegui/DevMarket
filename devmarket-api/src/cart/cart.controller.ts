import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(
    @Req() req: Request,
    @Body('productId') productId: number,
    @Body('quantity') quantity: number,
  ) {
    const userId = (req.user as any).id;
    return this.cartService.addToCart(userId, productId, quantity);
  }

  @Get('me')
  getMyCart(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.cartService.getActiveCart(userId);
  }

  @Delete('product/:productId')
  removeProduct(
    @Req() req: Request,
    @Param('productId') productId: string,
  ) {
    const userId = (req.user as any).id;
    return this.cartService.removeProduct(userId, +productId);
  }

  @Post('checkout')
  checkout(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.cartService.checkout(userId);
  }
}
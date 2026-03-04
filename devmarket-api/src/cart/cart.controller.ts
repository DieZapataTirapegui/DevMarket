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
import { AddToCartDto } from './dto/add-to-cart.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(
    @Req() req: Request,
    @Body() dto: AddToCartDto,
  ) {
  
    const userId = (req.user as any).userId;
  
    return this.cartService.addToCart(
      userId,
      dto.productId,
      dto.quantity,
    );
  }

  @Get('me')
  getMyCart(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.cartService.getActiveCart(userId);
  }

  @Delete('product/:productId')
  removeProduct(
    @Req() req: Request,
    @Param('productId') productId: string,
  ) {
    const userId = (req.user as any).userId;
    return this.cartService.removeProduct(userId, +productId);
  }

  @Post('checkout')
  checkout(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.cartService.checkout(userId);
  }
}
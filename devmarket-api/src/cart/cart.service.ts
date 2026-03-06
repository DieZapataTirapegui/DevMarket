import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart } from './entities/cart.entity';
import { CartItem } from '../cart-items/entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

@Injectable()
export class CartService {

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async addToCart(userId: number, productId: number, quantity: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
  
    if (!user) throw new NotFoundException('User not found');
  
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
  
    if (!product) throw new NotFoundException('Product not found');
  
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId }, isActive: true },
      relations: ['items', 'items.product'],
    });
  
    // Si no existe carrito activo, lo creamos
    if (!cart) {
      const newCart = this.cartRepository.create({
        user,
        isActive: true,
      });
  
      await this.cartRepository.save(newCart);
  
      cart = await this.cartRepository.findOne({
        where: { id: newCart.id },
        relations: ['items', 'items.product'],
      });
    }
  
    if (!cart) {
      throw new InternalServerErrorException('Cart creation failed');
    }
  
    // Si items es undefined (primer uso), lo inicializamos
    if (!cart.items) {
      cart.items = [];
    }
  
    let cartItem = cart.items.find(
      (item) => item.product.id === productId,
    );
  
    if (cartItem) {
      cartItem.quantity += quantity;
      await this.cartItemRepository.save(cartItem);
    } else {
      const newItem = this.cartItemRepository.create({
        cart,
        product,
        quantity,
      });
  
      await this.cartItemRepository.save(newItem);
    }
  
    // 🔄 Recargamos el carrito actualizado
    const updatedCart = await this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['items', 'items.product'],
    });
  
    if (!updatedCart) {
      throw new InternalServerErrorException('Cart reload failed');
    }
  
    // 💰 Cálculo de totales
   const subtotal = updatedCart.items.reduce(
     (acc, item) => acc + item.quantity * Number(item.product.price),
     0,
   );
  
    const totalItems = updatedCart.items.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
  
    return {
      ...updatedCart,
      subtotal: Number(subtotal.toFixed(2)),
      totalItems,
    };
  }

  async getActiveCart(userId: number) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId }, isActive: true },
      relations: ['items', 'items.product'],
    });
  
    if (!cart) {
      throw new NotFoundException('Active cart not found');
    }
  
    const itemsWithSubtotal = cart.items.map((item) => {
      const price = Number(item.product.price);
      const subtotal = price * item.quantity;
  
      return {
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        subtotal,
      };
    });
  
    const total = itemsWithSubtotal.reduce(
      (acc, item) => acc + item.subtotal,
      0,
    );
  
    const totalItems = itemsWithSubtotal.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
  
    return {
      id: cart.id,
      items: itemsWithSubtotal,
      totalItems,
      total,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }

  async removeProduct(userId: number, productId: number) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId }, isActive: true },
      relations: ['items', 'items.product'],
    });
  
    if (!cart) throw new NotFoundException('Cart not found');
  
    const item = cart.items.find(
      (item) => item.product.id === productId,
    );
  
    if (!item) throw new NotFoundException('Product not in cart');
  
    await this.cartItemRepository.remove(item);
  
    return this.getActiveCart(userId);    
  }

  async checkout(userId: number) {
  
    const cart = await this.cartRepository.findOne({
      where: {
        user: { id: userId },
        isActive: true,
      },
      relations: ['items', 'items.product', 'user'],
    });
  
    if (!cart) {
      throw new NotFoundException('Active cart not found');
    }
  
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }
  
    let total = 0;
  
    const order = this.orderRepository.create({
      user: cart.user,
      total: 0,
    });
  
    await this.orderRepository.save(order);
  
    const orderItems: OrderItem[] = [];
  
    for (const item of cart.items) {
  
      const price = Number(item.product.price);
      const subtotal = price * item.quantity;
  
      total += subtotal;
  
      const orderItem = this.orderItemRepository.create({
        order: order,
        product: item.product,
        quantity: item.quantity,
        priceAtPurchase: price,
      });
  
      orderItems.push(orderItem);
    }
  
    await this.orderItemRepository.save(orderItems);
  
    order.total = total;
  
    await this.orderRepository.save(order);
  
    cart.isActive = false;
    await this.cartRepository.save(cart);
  
    return this.orderRepository.findOne({
      where: { id: order.id },
      relations: ['items', 'items.product'],
    });
  }
}
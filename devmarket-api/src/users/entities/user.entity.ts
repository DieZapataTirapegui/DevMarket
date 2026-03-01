import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;
}
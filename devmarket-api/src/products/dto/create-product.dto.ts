import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProductDto {

  @IsNumber()
  externalId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  image: string;

  @IsString()
  category: string;
}
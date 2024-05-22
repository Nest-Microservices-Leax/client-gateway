import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, RawBody } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NAST_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  
  constructor(
    @Inject(NAST_SERVICE) private readonly productsClient: ClientProxy
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send({ cmd: 'create_product' }, createProductDto).pipe(
      catchError(error => { throw new RpcException(error) })
    );
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({
      cmd: 'find_all_products',
    }, paginationDto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Esta es una forma y mas recomendada
    // try {
    //   // espera el primer valor que observable va a emitir
    //   const product = await firstValueFrom(
    //     this.productsClient.send({ cmd: 'find_one_product'}, {id})
    //   );
    //   return product;
    // } catch (error) {
    //   throw new RpcException(error);
    // }

    //segunda opcion con rxjs
    return this.productsClient.send({ cmd: 'find_one_product'}, {id}).pipe(
      catchError(error => { throw new RpcException(error) })
    )
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError(error => { throw new RpcException(error) })
    )
  }

  @Patch(':id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsClient.send({ cmd: 'update_product' }, {
      id,
      ...updateProductDto
    }).pipe(
      catchError(error => { throw new RpcException(error) })
    )
  }
}

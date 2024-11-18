import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TerrainService } from './terrain.service';
import { CreateTerrainDto } from './dto/create-terrain.dto';
import { UpdateTerrainDto } from './dto/update-terrain.dto';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorators';

@Controller('terrain')
export class TerrainController {
  constructor(private readonly terrainService: TerrainService) {}

  @Post()
  create(@Body() createTerrainDto: CreateTerrainDto, @GetCurrentUser() user) {
    return this.terrainService.create(createTerrainDto, user);
  }

  @Get()
  findAll() {
    return this.terrainService.findAll();
  }

  @Get('/mine')
  findOne(@GetCurrentUserId() id: string) {
    return this.terrainService.getMyTerrain(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTerrainDto: UpdateTerrainDto) {
  //   return this.terrainService.update(+id, updateTerrainDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.terrainService.remove(+id);
  // }
}

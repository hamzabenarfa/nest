import { Controller, Body, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/my-profile')
  editProfile(
    @GetCurrentUserId() sub: string,
    @Body() userData: UpdateUserDto,
  ) {
    return this.userService.editProfile(sub, userData);
  }

  @Delete('/my-profile')
  deleteProfile(@GetCurrentUserId() sub: string) {
    return this.userService.deleteProfile(sub);
  }
}

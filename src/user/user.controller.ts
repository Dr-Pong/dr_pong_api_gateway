import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PatchUserImageRequestDto } from 'src/gateway/webserver/dtos/user-patch-input.dto';
import { UserService } from './user.service';
import { Requestor } from '../auth/jwt/auth.requestor.decorator';
import { User } from './user.entity';
import { PatchUserImageDto } from './dtos/patch-user-image.dto';
import { IsTfaOnResponseDto } from './dtos/tfa-on.response.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger: Logger = new Logger(UserController.name);

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:nickname/image')
  async usersImageByNicknamePatch(
    @Param('nickname') nickname: string,
    @Body() PatchRequestDto: PatchUserImageRequestDto,
    @Requestor() requestor: User,
    @Req() request,
  ): Promise<void> {
    const accessToken = request.headers.authorization;
    const patchUserImageDto: PatchUserImageDto = {
      userId: requestor.id,
      imgId: PatchRequestDto.id,
    };
    await this.userService.patchUserImage(
      nickname,
      accessToken,
      patchUserImageDto,
    );
  }

  @Get('/:nickname/tfa')
  @UseGuards(AuthGuard('jwt'))
  async isTfaOn(
    @Param('nickname') nickname: string,
    @Requestor() requestor: User,
  ): Promise<IsTfaOnResponseDto> {
    return await this.userService.isTfaOnByUser(requestor.id);
  }
}

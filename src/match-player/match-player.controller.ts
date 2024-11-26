import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MatchPlayerService } from './match-player.service';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('match-player')
export class MatchPlayerController {
  constructor(private readonly matchPlayerService: MatchPlayerService) {}

  @Post('/join/:matchId')
  joinMatch(@Param() param, @GetCurrentUserId() userId: string) {
    return this.matchPlayerService.joinMatch(param, userId);
  }

  @Get('/mine')
  findMyMatchPlayer(@GetCurrentUserId() userId: string) {
    return this.matchPlayerService.findMyMatchPlayer(userId);
  }
  @Get('/all')
  findAllMatchPlayer() {
    return this.matchPlayerService.findAllMatchPlayer();
  }

  @Get('/participants-in-my-match')
  getParticipantsInMyMatch(@GetCurrentUserId() id: string) {
    return this.matchPlayerService.getParticipantsInMyMatch(id);
  }

  @Get('/participants-in-match/:matchId')
  getParticipantsInMatchById(@Param('matchId') matchId: string) {
    return this.matchPlayerService.getParticipantsInMatchById(matchId);
  }
  @Put('/accept/:playermatchId')
  acceptMatch(@Param('playermatchId') playerMatchId: string) {
    return this.matchPlayerService.acceptMatch(playerMatchId);
  }
  @Put('/reject/:playermatchId')
  rejectMatch(@Param('playermatchId') playerMatchId: string) {
    return this.matchPlayerService.rejectMatch(playerMatchId);
  }
}

import { forwardRef, Module } from '@nestjs/common';
import { MatchPlayerService } from './match-player.service';
import { MatchPlayerController } from './match-player.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchPlayer, MatchPlayerSchema } from './entities/match-player.entity';
import { MatchModule } from 'src/match/match.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MatchPlayer.name, schema: MatchPlayerSchema },
    ]),
    forwardRef(() => MatchModule),
  ],
  controllers: [MatchPlayerController],
  providers: [MatchPlayerService],
  exports: [MatchPlayerService],
})
export class MatchPlayerModule {}

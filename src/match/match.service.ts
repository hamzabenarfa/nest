import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Match } from './entities/match.entity';
import { Model } from 'mongoose';
import { MatchPlayerService } from 'src/match-player/match-player.service';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<Match>,
    @Inject(forwardRef(() => MatchPlayerService))
    private readonly matchPlayerService: MatchPlayerService,
  ) {}

  async createMatch(userId: string, createMatchDto: CreateMatchDto) {
    const matchCreated = await this.matchModel.create({
      ...createMatchDto,
      userId,
    });

    this.matchPlayerService.joinMatch(
      { matchId: matchCreated._id },
      userId,
      true,
    );
    return matchCreated;
  }

  async findAllMatches() {
    return await this.matchModel
      .find()
      .populate({ path: 'userId', select: 'email name last_name phone' })
      .populate('terrainId')
      .exec();
  }

  async findMyMatches(id: string) {
    return await this.matchModel
      .find({ userId: id })
      .populate({ path: 'userId', select: 'email name last_name phone' })
      .populate('terrainId')
      .exec();
  }

  async isMyMatch(userId: string, matchId: string) {
    const match = await this.matchModel.findById(matchId);
    return match.userId.toString() === userId;
  }
  
}

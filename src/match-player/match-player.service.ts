import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MatchPlayer } from './entities/match-player.entity';
import { Model } from 'mongoose';
import { MatchService } from 'src/match/match.service';

@Injectable()
export class MatchPlayerService {
  constructor(
    @InjectModel(MatchPlayer.name) private matchPLayerModel: Model<MatchPlayer>,
    @Inject(forwardRef(() => MatchService))
    private readonly matchService: MatchService,
  ) {}

  async joinMatch(param, userId: string, isAccepted: boolean = false) {
    const playerAlreadyJoined = await this.matchPLayerModel.findOne({
      matchId: param.matchId,
      userId,
    });
    if (playerAlreadyJoined) {
      throw new HttpException(
        'You have already joined this match',
        HttpStatus.BAD_REQUEST,
      );
    }
    const match = await this.matchPLayerModel.create({
      matchId: param.matchId,
      userId,
      isAccepted,
    });

    return match;
  }

  async findMyMatchPlayer(userId: string) {
    const matchPlayer = await this.matchPLayerModel
      .find({})
      .populate('matchId')
      .populate({ path: 'userId', select: 'email name last_name phone' })
      .exec();

    const myMatchPlayer = matchPlayer.filter((m) => {
      if (m.matchId && m.matchId.userId) {
        return m.matchId.userId.toString() === userId;
      }
      return false;
    });

    return myMatchPlayer;
  }
  async findAllMatchPlayer() {
    const matchPlayer = await this.matchPLayerModel
      .find({})
      .populate('matchId')
      .populate({ path: 'userId', select: 'email name last_name phone' })
      .exec();

    return matchPlayer;
  }

  async getParticipantsInMyMatch(id) {
    const myMatches = await this.matchService.findMyMatches(id);
    const matchIds = myMatches
      .map((match) => match._id)
      .toString()
      .split(',');
    const participants = await this.matchPLayerModel
      .find({
        matchId: { $in: matchIds },
      })
      .populate('matchId')
      .populate({ path: 'userId', select: 'email name last_name phone' })
      .exec();
    return participants;
  }
  async getParticipantsInMatchById(matchId) {
    const participants = await this.matchPLayerModel
      .find({
        matchId: matchId,
      })
      .populate('matchId')
      .populate({ path: 'userId', select: 'email name last_name phone' })
      .exec();
    return participants;
  }

  async acceptMatch(playeMatchId) {
    const playerMatchExist = await this.matchPLayerModel.findByIdAndUpdate(
      playeMatchId,
      { isAccepted: true },
      { new: true },
    );
    if (!playerMatchExist) {
      throw new HttpException('Player match not found', HttpStatus.NOT_FOUND);
    }
    return playerMatchExist;
  }

  async rejectMatch(playeMatchId){
    const playerMatchExist = await this.matchPLayerModel.findByIdAndUpdate(
      playeMatchId,
      { isAccepted: false },
      { new: true },
    );
    if (!playerMatchExist) {
      throw new HttpException('Player match not found', HttpStatus.NOT_FOUND);
    }
    return playerMatchExist;
  }
}

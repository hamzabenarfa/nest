import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Match } from 'src/match/entities/match.entity';

export type EquipeDocument = HydratedDocument<Equipe>;

@Schema({ timestamps: true })
export class Equipe {
  @Prop()
  equipre: 'A' | 'B';

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Match', required: true })
  matchId: Match;
}

const EquipeSchema = SchemaFactory.createForClass(Equipe);

export { EquipeSchema };

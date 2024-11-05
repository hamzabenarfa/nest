import {
  HttpException,
  HttpStatus,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { SignupDto } from './dto/signup.dto';
import { Tokens } from './types';
import { MailerService } from 'src/mailer/mailer.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService,
    private readonly tokenService: TokenService,
  ) {}

  async otpSend(data): Promise<boolean> {
    const userExist = await this.userModel.findOne({ email: data.email });
    if (!userExist) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const otp = this.mailerService.generateOtp();

    await this.mailerService.sendMail({
      to: userExist.email,
      subject: 'OTP',
      text: otp.toString(),
    });

    return true;
  }

  otpVerify(code) {
    return this.mailerService.verifyOtp(code);
  }

  async login(loginData: LoginDto): Promise<Tokens> {
    const userExist = await this.userModel.findOne({ email: loginData.email });
    if (!userExist) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const passwordMatch = await argon2.verify(
      userExist.password,
      loginData.password,
    );
    if (!passwordMatch) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    const tokens = await this.tokenService.generateTokens(
      userExist._id.toString(),
      userExist.email,
      userExist.role,
    );
    await this.tokenService.updateRtHash(
      userExist._id.toString(),
      tokens.refresh_token,
    );
    return tokens;
  }

  async logout(userId: string) {
    await this.tokenService.clearRtHash(userId);
    return true;
  }

  async signup(signupData: SignupDto): Promise<Tokens> {
    const userExist = await this.userModel.findOne({ email: signupData.email });
    if (userExist) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await argon2.hash(signupData.password);
    const newUser = new this.userModel({
      ...signupData,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    const tokens = await this.tokenService.generateTokens(
      savedUser._id.toString(),
      savedUser.email,
      savedUser.role,
    );
    await this.tokenService.updateRtHash(
      savedUser._id.toString(),
      tokens.refresh_token,
    );

    await this.mailerService.sendMail({
      to: savedUser.email,
      subject: 'Account Created',
      text: 'Your account has been created successfully',
    });

    return tokens;
  }

  async refresh(userId: string, rt: string): Promise<Tokens> {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user || !user.hashRt) {
      throw new ForbiddenException('Access Denied');
    }

    await this.tokenService.verifyRefreshToken(user.hashRt, rt);

    const tokens = await this.tokenService.generateTokens(
      user._id.toString(),
      user.email,
      user.role,
    );
    await this.tokenService.updateRtHash(
      user._id.toString(),
      tokens.refresh_token,
    );

    return tokens;
  }
}

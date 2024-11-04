import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async login(loginData: LoginDto) {
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

    return userExist;
  }

  async signup(signupData: SignupDto) {
    const userExist = await this.userModel.findOne({ email: signupData.email });
    if (userExist) {
      throw new HttpException('User found', HttpStatus.CONFLICT);
    }
    const hashedPassword = await argon2.hash(signupData.password);
    const newUser = new this.userModel({
      ...signupData,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    return savedUser;
  }
}

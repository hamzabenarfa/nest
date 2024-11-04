import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(
      'mongodb+srv://mohameddhaouedi:mohamed@cluster0.dsb09.mongodb.net/projet?retryWrites=true&w=majority&appName=Cluster0',
    ),
    AuthModule,
  ],
})
export class AppModule {}

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dto/send-mail.dto';
import { authenticator } from 'otplib';

@Injectable()
export class MailerService {
  mailTransport() {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return transporter;
  }

  async sendMail({ to, subject, text }: SendMailDto) {
    const transporter = this.mailTransport();
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
    });
  }

  generateOtp() {
    return authenticator.generate(process.env.OTP_SECRET);
  }

  verifyOtp(token: string) {
    return authenticator.verify({ token, secret: process.env.OTP_SECRET });
  } 
}

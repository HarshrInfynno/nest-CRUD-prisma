import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendForgotPasswordMail(mailProps: {
    data: any;
    template: any;
    subject: any;
    context: object;
  }) {
    await this.mailerService.sendMail({
      to: mailProps.data.email,
      subject: mailProps.subject,
      template: mailProps.template,
      context: mailProps.context,
    });
  }
}

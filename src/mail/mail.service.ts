import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
// import { User } from './../user/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendForgotPasswordMail(mailProps: {
    data: any;
    // token: string,
    template: any;
    subject: any;
    context: object;
  }) {
    // const url = `test.com/auth/confirm?token=${token}`;
    await this.mailerService.sendMail({
      to: mailProps.data.email,
      subject: mailProps.subject,
      template: mailProps.template,
      context: mailProps.context,
    });
  }

  //   async sendUserConfirmation(user: User, token: string) {
  //     const url = `example.com/auth/confirm?token=${token}`;

  //     await this.mailerService.sendMail({
  //       to: user.email,
  //       // from: '"Support Team" <support@example.com>', // override default from
  //       subject: 'Welcome to Nice App! Confirm your Email',
  //       template: './confirmation', // `.hbs` extension is appended automatically
  //       context: {
  //         // ✏️ filling curly brackets with content
  //         name: user.name,
  //         url,
  //       },
  //     });
  //   }
}

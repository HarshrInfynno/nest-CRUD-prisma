import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import * as path from 'path';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => {
        return {
          transport: {
            port: 587,
            host: 'smtp.gmail.com',
            secure: false,
            auth: {
              user: '<>user-mail<>',
              pass: '<>user-mail-password<>',
            },
          },
          defaults: {
            from: `"No Reply"`,
          },
          template: {
            dir: path.join(__dirname, '../../../common/templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(ContactService.name);

  constructor(private configService: ConfigService) {
    const port = Number(this.configService.get('SMTP_PORT'));
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: port,
      secure: port === 465,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendContactEmail(contactDto: ContactDto): Promise<{ success: boolean; message: string }> {
    const { name, email, phone, subject, message } = contactDto;
    
    const phoneText = phone ? `\nPhone: ${phone}` : '';
    const phoneHtml = phone ? `<p><strong>Phone:</strong> ${phone}</p>` : '';

    const mailOptions = {
      from: this.configService.get<string>('MAIL_FROM'),
      to: this.configService.get<string>('MAIL_TO'),
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      text: `You have received a new contact form submission.\n\nName: ${name}\nEmail: ${email}${phoneText}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phoneHtml}
        <p><strong>Subject:</strong> ${subject}</p>
        <h4>Message:</h4>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Contact email successfully delivered to: ${mailOptions.to}`);
      return { success: true, message: 'Your message has been sent successfully.' };
    } catch (error) {
      this.logger.error(`Failed to send contact email: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to send message. Please try again later.');
    }
  }
}

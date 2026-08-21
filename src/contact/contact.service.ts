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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Request</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: Arial, sans-serif; color: #333333;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f7f6; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); max-width: 100%;">
                  
                  <!-- Header -->
                  <tr>
                    <td align="center" style="background-color: #ffffff; padding: 30px 20px; border-bottom: 3px solid #0a1a4f;">
                      <img src="https://alnadascientific.com/img/alnada.png" alt="Al Nada Scientific" width="180" style="display: block; max-width: 100%; height: auto;" />
                    </td>
                  </tr>

                  <!-- Title -->
                  <tr>
                    <td align="center" style="background-color: #0a1a4f; padding: 20px;">
                      <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: normal; letter-spacing: 1px;">NEW CONTACT REQUEST</h2>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding-bottom: 15px;">
                            <span style="font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 1px;">Customer Details</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; border: 1px solid #eeeeee;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td width="100" style="padding-bottom: 10px; font-weight: bold; color: #555;">Name:</td>
                                <td style="padding-bottom: 10px; color: #111;">${name}</td>
                              </tr>
                              <tr>
                                <td width="100" style="padding-bottom: 10px; font-weight: bold; color: #555;">Email:</td>
                                <td style="padding-bottom: 10px;">
                                  <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                                </td>
                              </tr>
                              ${phone ? `
                              <tr>
                                <td width="100" style="padding-bottom: 10px; font-weight: bold; color: #555;">Phone:</td>
                                <td style="padding-bottom: 10px;">
                                  <a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a>
                                </td>
                              </tr>
                              ` : ''}
                            </table>
                          </td>
                        </tr>
                      </table>

                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px;">
                        <tr>
                          <td style="padding-bottom: 15px;">
                            <span style="font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 1px;">Subject</span>
                            <div style="font-size: 18px; font-weight: bold; color: #0a1a4f; margin-top: 5px;">${subject}</div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span style="font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 1px;">Message</span>
                            <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin-top: 8px; color: #333333; line-height: 1.6; font-size: 15px; white-space: pre-wrap;">${message}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="background-color: #f8f9fa; padding: 25px 20px; border-top: 1px solid #eeeeee;">
                      <p style="margin: 0 0 10px 0; font-size: 13px; color: #666666;">
                        <strong>Al Nada Scientific Office</strong><br>
                        67 Mahattet ElKoba, Cairo, Egypt
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #888888;">
                        <a href="mailto:info@alnadascientific.com" style="color: #666666; text-decoration: underline;">info@alnadascientific.com</a>
                        &nbsp;|&nbsp;
                        <a href="tel:+201007015047" style="color: #666666; text-decoration: underline;">+20 100 701 5047</a>
                      </p>
                    </td>
                  </tr>

                </table>
                
                <!-- Reply Hint -->
                <p style="text-align: center; font-size: 12px; color: #999999; margin-top: 20px;">
                  This email was automatically generated from your website's contact form.<br>
                  You can reply directly to this email to respond to the customer.
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
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

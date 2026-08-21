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
        <body style="margin: 0; padding: 0; background-color: #070d24; font-family: Arial, sans-serif; color: #e2e8f0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #070d24; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #0a1433; border-radius: 8px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); max-width: 100%;">
                  
                  <!-- Header -->
                  <tr>
                    <td align="center" style="background-color: #0a1433; padding: 30px 20px; border-bottom: 2px solid #1e293b;">
                      <img src="https://alnadascientific.com/img/alnadadr.png" alt="Al Nada Scientific" width="180" style="display: block; max-width: 100%; height: auto;" />
                    </td>
                  </tr>

                  <!-- Title -->
                  <tr>
                    <td align="center" style="background-color: #1e3a8a; padding: 20px;">
                      <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: bold; letter-spacing: 2px;">NEW CONTACT REQUEST</h2>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding-bottom: 15px;">
                            <span style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Customer Details</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="background-color: #0f172a; border-radius: 8px; padding: 25px; border: 1px solid #1e293b;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td width="100" style="padding-bottom: 12px; font-weight: bold; color: #64748b; font-size: 14px;">Name:</td>
                                <td style="padding-bottom: 12px; color: #f8fafc; font-size: 15px;">${name}</td>
                              </tr>
                              <tr>
                                <td width="100" style="padding-bottom: 12px; font-weight: bold; color: #64748b; font-size: 14px;">Email:</td>
                                <td style="padding-bottom: 12px;">
                                  <a href="mailto:${email}" style="color: #60a5fa; text-decoration: none; font-size: 15px;">${email}</a>
                                </td>
                              </tr>
                              ${phone ? `
                              <tr>
                                <td width="100" style="font-weight: bold; color: #64748b; font-size: 14px;">Phone:</td>
                                <td>
                                  <a href="tel:${phone}" style="color: #60a5fa; text-decoration: none; font-size: 15px;">${phone}</a>
                                </td>
                              </tr>
                              ` : ''}
                            </table>
                          </td>
                        </tr>
                      </table>

                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 35px;">
                        <tr>
                          <td style="padding-bottom: 15px;">
                            <span style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Subject</span>
                            <div style="font-size: 20px; font-weight: bold; color: #f8fafc; margin-top: 8px;">${subject}</div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 15px;">
                            <span style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Message</span>
                            <div style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 25px; margin-top: 12px; color: #cbd5e1; line-height: 1.7; font-size: 15px; white-space: pre-wrap;">${message}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="background-color: #070d24; padding: 30px 20px; border-top: 1px solid #1e293b;">
                      <p style="margin: 0 0 10px 0; font-size: 13px; color: #94a3b8;">
                        <strong style="color: #cbd5e1;">Al Nada Scientific Office</strong><br>
                        67 Mahattet ElKoba, Cairo, Egypt
                      </p>
                      <p style="margin: 0; font-size: 13px; color: #64748b;">
                        <a href="mailto:info@alnadascientific.com" style="color: #94a3b8; text-decoration: underline;">info@alnadascientific.com</a>
                        &nbsp;|&nbsp;
                        <a href="tel:+201007015047" style="color: #94a3b8; text-decoration: underline;">+20 100 701 5047</a>
                      </p>
                    </td>
                  </tr>

                </table>
                
                <!-- Reply Hint -->
                <p style="text-align: center; font-size: 12px; color: #64748b; margin-top: 25px;">
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

import nodemailer from 'nodemailer';
import { PrismaClient } from "@prisma/client";


export class EmailService {
  private transporter: nodemailer.Transporter;
  private prisma = new PrismaClient();

  constructor() {
    this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      
    this.prisma = new PrismaClient();
  }

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      text
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(to: string, userName: string) {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Our Platform</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                  <td align="center" style="padding: 0;">
                      <table role="presentation" style="width: 602px; border-collapse: collapse; border: 1px solid #cccccc; background-color: #ffffff;">
                          <tr>
                              <td align="center" style="padding: 40px 0 30px 0; background-color: #003366;">
                                  <h1 style="font-size: 24px; margin: 0; color: #ffffff;">Welcome to Our Platform</h1>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 36px 30px 42px 30px;">
                                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                      <tr>
                                          <td style="padding: 0 0 36px 0; color: #153643;">
                                              <h2 style="font-size: 24px; margin: 0 0 20px 0; color: #003366;">Hello ${userName},</h2>
                                              <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Welcome to our event management platform. We're excited to have you on board!</p>
                                              <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Get ready to explore exciting events and create unforgettable experiences.</p>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 0;">
                                              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                  <tr>
                                                      <td align="center" style="padding: 0;">
                                                          <a href="#" style="color: #ffffff; background-color: #003366; border: 1px solid #003366; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 6px; font-weight: bold; font-size: 18px;">Explore Events</a>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 30px; background-color: #003366;">
                                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                      <tr>
                                          <td style="padding: 0; width: 50%;" align="left">
                                              <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2023 Your Company Name<br/></p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>
    `;
  
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject: 'Welcome to Our Platform',
      html: htmlContent
    };
  
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent: ' + info.response);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }
  


  //Welcome email ends here 


  //create reservation email starts here
  async sendReservationConfirmation(reservationId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { reservationId },
      include: {
        event: true,
        user: true
      }
    });
  
    if (!reservation) {
      console.error('Reservation not found for id:', reservationId);
      return false;
    }
  
    const { event, user } = reservation;
  
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reservation Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                  <td align="center" style="padding: 0;">
                      <table role="presentation" style="width: 602px; border-collapse: collapse; border: 1px solid #cccccc; background-color: #ffffff;">
                          <tr>
                              <td align="center" style="padding: 40px 0 30px 0; background-color: #003366;">
                                  <h1 style="font-size: 24px; margin: 0; color: #ffffff;">Reservation Confirmation</h1>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 36px 30px 42px 30px;">
                                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                      <tr>
                                          <td style="padding: 0 0 36px 0; color: #153643;">
                                              <h2 style="font-size: 24px; margin: 0 0 20px 0; color: #003366;">Hello ${user.name},</h2>
                                              <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Your reservation for the event "${event.name}" has been confirmed.</p>
                                              <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Event Details:</p>
                                              <ul style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">
                                                  <li>Date: ${event.date.toLocaleDateString()}</li>
                                                  <li>Time: ${event.time.toLocaleTimeString()}</li>
                                                  <li>Location: ${event.location}</li>
                                              </ul>
                                              <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">We look forward to seeing you there!</p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 30px; background-color: #003366;">
                                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                      <tr>
                                          <td style="padding: 0; width: 50%;" align="left">
                                              <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2023 Your Company Name<br/></p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>
    `;
  
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: 'Event Reservation Confirmation',
      html: htmlContent
    };
  
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Reservation confirmation email sent: ' + info.response);
      return true;
    } catch (error) {
      console.error('Error sending reservation confirmation email:', error);
      return false;
    }
  }

  //reservation email endds here


  //user notifcation for new event
  async sendNewEventNotification(userId: string, eventId: string) {
    const user = await this.prisma.user.findUnique({ where: { userId } });
    const event = await this.prisma.event.findUnique({ where: { eventId } });
  
    if (!user || !event) {
      console.error('User or Event not found');
      return false;
    }
  
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Event Notification</title>
          <link href="https://fonts.googleapis.com/css2?family=Monoton&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                  <td align="center" style="padding: 0;">
                      <table role="presentation" style="width: 602px; border-collapse: collapse; border: 1px solid #cccccc; background-color: #ffffff;">
                          <tr>
                              <td align="center" style="padding: 40px 0 30px 0; background-color: #003366;">
                                  <h1 style="font-family: 'Monoton', cursive; font-size: 36px; margin: 0; color: #ffffff;">PLAN-A</h1>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 36px 30px 42px 30px;">
                                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                      <tr>
                                          <td style="padding: 0 0 36px 0; color: #153643;">
                                              <h2 style="font-size: 24px; margin: 0 0 20px 0; color: #003366;">Hello ${user.name},</h2>
                                              <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">We're excited to announce a new event!</p>
                                              <h3 style="font-size: 18px; margin: 0 0 12px 0; color: #003366;">${event.name}</h3>
                                              <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">${event.description}</p>
                                              <ul style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">
                                                  <li>Date: ${event.date.toLocaleDateString()}</li>
                                                  <li>Time: ${event.time.toLocaleTimeString()}</li>
                                                  <li>Location: ${event.location}</li>
                                              </ul>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 0;">
                                              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                  <tr>
                                                      <td align="center" style="padding: 0;">
                                                          <a href="#" style="color: #ffffff; background-color: #003366; border: 1px solid #003366; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 6px; font-weight: bold; font-size: 18px;">View Event Details</a>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 30px; background-color: #003366;">
                                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                      <tr>
                                          <td style="padding: 0; width: 50%;" align="left">
                                              <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2023 PLAN-A<br/></p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>
    `;
  
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: 'New Event Announcement: ' + event.name,
      html: htmlContent
    };
  
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('New event notification email sent: ' + info.response);
      return true;
    } catch (error) {
      console.error('Error sending new event notification email:', error);
      return false;
    }
  }
    //user notifcation for new event ends here
    
    //notification to admin for created event
    async sendNewEventAdminNotification(adminEmail: string, eventId: string, eventName: string) {
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Event Requires Approval</title>
              <link href="https://fonts.googleapis.com/css2?family=Monoton&display=swap" rel="stylesheet">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                      <td align="center" style="padding: 0;">
                          <table role="presentation" style="width: 602px; border-collapse: collapse; border: 1px solid #cccccc; background-color: #ffffff;">
                              <tr>
                                  <td align="center" style="padding: 40px 0 30px 0; background-color: #003366;">
                                      <h1 style="font-family: 'Monoton', cursive; font-size: 36px; margin: 0; color: #ffffff;">PLAN-A</h1>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="padding: 36px 30px 42px 30px;">
                                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                          <tr>
                                              <td style="padding: 0 0 36px 0; color: #153643;">
                                                  <h2 style="font-size: 24px; margin: 0 0 20px 0; color: #003366;">New Event Requires Approval</h2>
                                                  <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">A new event "${eventName}" has been created and requires your approval.</p>
                                                  <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Please review the event details and take appropriate action.</p>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0;">
                                                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                      <tr>
                                                          <td align="center" style="padding: 0;">
                                                              <a href="${process.env.FRONTEND_URL}/admin/events/${eventId}" style="color: #ffffff; background-color: #003366; border: 1px solid #003366; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 6px; font-weight: bold; font-size: 18px;">Review Event</a>
                                                          </td>
                                                      </tr>
                                                  </table>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="padding: 30px; background-color: #003366;">
                                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                          <tr>
                                              <td style="padding: 0; width: 50%;" align="left">
                                                  <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2023 PLAN-A<br/></p>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
          </body>
          </html>
        `;
      
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: adminEmail,
          subject: 'New Event Requires Approval: ' + eventName,
          html: htmlContent
        };
      
        try {
          const info = await this.transporter.sendMail(mailOptions);
          console.log('Admin notification email sent: ' + info.response);
          return true;
        } catch (error) {
          console.error('Error sending admin notification email:', error);
          return false;
        }
      }
      //admin notification ends here



      //notification for manager for approved events
      async sendEventApprovalNotification(managerEmail: string, eventName: string) {
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Event Approved</title>
              <link href="https://fonts.googleapis.com/css2?family=Monoton&display=swap" rel="stylesheet">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                      <td align="center" style="padding: 0;">
                          <table role="presentation" style="width: 602px; border-collapse: collapse; border: 1px solid #cccccc; background-color: #ffffff;">
                              <tr>
                                  <td align="center" style="padding: 40px 0 30px 0; background-color: #003366;">
                                      <h1 style="font-family: 'Monoton', cursive; font-size: 36px; margin: 0; color: #ffffff;">PLAN-A</h1>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="padding: 36px 30px 42px 30px;">
                                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                          <tr>
                                              <td style="padding: 0 0 36px 0; color: #153643;">
                                                  <h2 style="font-size: 24px; margin: 0 0 20px 0; color: #003366;">Event Approved</h2>
                                                  <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Great news! Your event "${eventName}" has been approved.</p>
                                                  <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Your event is now visible to all users and ready for bookings.</p>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="padding: 30px; background-color: #003366;">
                                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                          <tr>
                                              <td style="padding: 0; width: 50%;" align="left">
                                                  <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2023 PLAN-A<br/></p>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
          </body>
          </html>
        `;
      
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: managerEmail,
          subject: 'Your Event Has Been Approved: ' + eventName,
          html: htmlContent
        };
      
        try {
          const info = await this.transporter.sendMail(mailOptions);
          console.log('Event approval notification sent: ' + info.response);
          return true;
        } catch (error) {
          console.error('Error sending event approval notification:', error);
          return false;
        }
      }


      //manager norfication ends here


      //..rejected notifiatio to manager
      
      async sendEventRejectionNotification(managerEmail: string, eventName: string) {
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Event Rejected</title>
              <link href="https://fonts.googleapis.com/css2?family=Monoton&display=swap" rel="stylesheet">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                      <td align="center" style="padding: 0;">
                          <table role="presentation" style="width: 602px; border-collapse: collapse; border: 1px solid #cccccc; background-color: #ffffff;">
                              <tr>
                                  <td align="center" style="padding: 40px 0 30px 0; background-color: #003366;">
                                      <h1 style="font-family: 'Monoton', cursive; font-size: 36px; margin: 0; color: #ffffff;">PLAN-A</h1>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="padding: 36px 30px 42px 30px;">
                                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                          <tr>
                                              <td style="padding: 0 0 36px 0; color: #153643;">
                                                  <h2 style="font-size: 24px; margin: 0 0 20px 0; color: #003366;">Event Rejected</h2>
                                                  <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">We regret to inform you that your event "${eventName}" has been rejected.</p>
                                                  <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Please review our event guidelines and consider submitting a revised event proposal.</p>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="padding: 30px; background-color: #003366;">
                                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                          <tr>
                                              <td style="padding: 0; width: 50%;" align="left">
                                                  <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2023 PLAN-A<br/></p>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
          </body>
          </html>
        `;
      
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: managerEmail,
          subject: 'Your Event Has Been Rejected: ' + eventName,
          html: htmlContent
        };
      
        try {
          const info = await this.transporter.sendMail(mailOptions);
          console.log('Event rejection notification sent: ' + info.response);
          return true;
        } catch (error) {
          console.error('Error sending event rejection notification:', error);
          return false;
        }
      }
      

      //event cancelation mail
      async sendEventCancellationNotification(managerEmail: string, eventName: string) {
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Event Cancelled</title>
              <link href="https://fonts.googleapis.com/css2?family=Monoton&display=swap" rel="stylesheet">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                      <td align="center" style="padding: 0;">
                          <table role="presentation" style="width: 602px; border-collapse: collapse; border: 1px solid #cccccc; background-color: #ffffff;">
                              <tr>
                                  <td align="center" style="padding: 40px 0 30px 0; background-color: #003366;">
                                      <h1 style="font-family: 'Monoton', cursive; font-size: 36px; margin: 0; color: #ffffff;">PLAN-A</h1>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="padding: 36px 30px 42px 30px;">
                                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                          <tr>
                                              <td style="padding: 0 0 36px 0; color: #153643;">
                                                  <h2 style="font-size: 24px; margin: 0 0 20px 0; color: #003366;">Event Cancelled</h2>
                                                  <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Your event "${eventName}" has been cancelled.</p>
                                                  <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">If you have any questions or concerns, please contact our support team.</p>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="padding: 30px; background-color: #003366;">
                                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                          <tr>
                                              <td style="padding: 0; width: 50%;" align="left">
                                                  <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2023 PLAN-A<br/></p>
                                              </td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
          </body>
          </html>
        `;
      
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: managerEmail,
          subject: 'Your Event Has Been Cancelled: ' + eventName,
          html: htmlContent
        };
      
        try {
          const info = await this.transporter.sendMail(mailOptions);
          console.log('Event cancellation notification sent: ' + info.response);
          return true;
        } catch (error) {
          console.error('Error sending event cancellation notification:', error);
          return false;
        }
      }
      

}
  
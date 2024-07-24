import nodemailer from 'nodemailer';
import { PrismaClient } from "@prisma/client";
import { Event } from '../interfaces/events';
import { Reservation } from '../interfaces/reservation';
import { User } from '../interfaces/users';

import QRCode from 'qrcode';

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

    async generateQRCode(reservationId: string): Promise<string> {
        const qrCodeDataUrl = await QRCode.toDataURL(reservationId);
        return qrCodeDataUrl;
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
          <title>Welcome to PLAN-A</title>
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
                                              <h2 style="font-size: 24px; margin: 0 0 20px 0; color: #003366;">Welcome to PLAN-A, ${userName}!</h2>
                                              <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">We're excited to have you on board our event management platform.</p>
                                              <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Get ready to explore exciting events and create unforgettable experiences.</p>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="padding: 0;">
                                              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                                  <tr>
                                                      <td align="center" style="padding: 0;">
                                                          <a href="${process.env.FRONTEND_URL}/events" style="color: #ffffff; background-color: #003366; border: 1px solid #003366; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 6px; font-weight: bold; font-size: 18px;">Explore Events</a>
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
                                              <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2024 PLAN-A<br/></p>
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
            subject: 'Welcome to PLAN-A',
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

        const ticketType = reservation.isRegular ? 'Regular' : (reservation.isVIP ? 'VIP' : 'Children');

        const reservationInfo = JSON.stringify({
            reservationId,
            eventId: event.eventId,
            eventName: event.name,
            userName: user.name,
            numberOfPeople: reservation.numberOfPeople,
            ticketType
        });

        const qrCodeDataUrl = await this.generateQRCode(reservationInfo);

        const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reservation Confirmation</title>
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
                                              <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Your reservation for the event "${event.name}" has been confirmed.</p>
                                              <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Reservation Details:</p>
                                              <ul style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">
                                                  <li>Reservation ID: ${reservationId}</li>
                                                  <li>Number of People: ${reservation.numberOfPeople}</li>
                                                  <li>Ticket Type: ${ticketType}</li>
                                              </ul>
                                              <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Event Details:</p>
                                              <ul style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">
                                                  <li>Event ID: ${event.eventId}</li>
                                                  <li>Date: ${event.date.toLocaleDateString()}</li>
                                                  <li>Time: ${event.time}</li>
                                                  <li>Location: ${event.location}</li>
                                              </ul>
                                              <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">We look forward to seeing you there!</p>
                                              <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Your QR Code (contains all reservation details):</p>
                                              <img src="cid:qr-code" alt="Reservation QR Code" style="max-width: 200px; height: auto;" />
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
                                              <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2024 PLAN-A<br/></p>
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
            html: htmlContent,
            attachments: [{
                filename: 'qr-code.png',
                content: qrCodeDataUrl.split(';base64,').pop(),
                encoding: 'base64',
                cid: 'qr-code'
            }]
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
                                                  <li>Time: ${event.time}</li>
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
                                              <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2024 PLAN-A<br/></p>
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
                                                  <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2024 PLAN-A<br/></p>
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
                                                  <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2024 PLAN-A<br/></p>
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
                                                  <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2024 PLAN-A<br/></p>
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


    async sendEventCancellationNotification(userEmail: string, eventName: string, managerName: string, managerEmail: string, managerPhone: string) {
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
                                                  <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">We regret to inform you that the event "${eventName}" has been cancelled.</p>
                                                  <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">If you have any questions or concerns, please contact the event manager:</p>
                                                  <ul style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">
                                                      <li>Name: ${managerName}</li>
                                                      <li>Email: ${managerEmail}</li>
                                                      <li>Phone: ${managerPhone}</li>
                                                  </ul>
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
                                                  <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2024 PLAN-A<br/></p>
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
            to: userEmail,
            subject: 'Event Cancellation Notice: ' + eventName,
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




    ///events updates mail
    async sendEventUpdateNotification(userEmail: string, eventName: string, managerName: string, managerEmail: string, managerPhone: string, updatedEvent: Event) {
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Event Update</title>
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
                                                  <h2 style="font-size: 24px; margin: 0 0 20px 0; color: #003366;">Event Update: ${eventName}</h2>
                                                  <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">The event "${eventName}" has been updated. Here are the new details:</p>
                                                  <ul style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">
                                                      <li>Date: ${updatedEvent.date.toLocaleDateString()}</li>
                                                      <li>Time: ${updatedEvent.time}</li>
                                                      <li>Location: ${updatedEvent.location}</li>
                                                      <li>Description: ${updatedEvent.description}</li>
                                                  </ul>
                                                  <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">If you have any questions, please contact the event manager:</p>
                                                  <ul style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">
                                                      <li>Name: ${managerName}</li>
                                                      <li>Email: ${managerEmail}</li>
                                                      <li>Phone: ${managerPhone}</li>
                                                  </ul>
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
                                                  <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2024 PLAN-A<br/></p>
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
            to: userEmail,
            subject: 'Event Update: ' + eventName,
            html: htmlContent
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Event update notification sent: ' + info.response);
            return true;
        } catch (error) {
            console.error('Error sending event update notification:', error);
            return false;
        }
    }


    async sendNewReservationNotification(recipientEmail: string, reservation: Reservation, event: Event) {
        const ticketType = reservation.isRegular ? 'Regular' : (reservation.isVIP ? 'VIP' : 'Children');
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Reservation Notification</title>
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
                                                  <h2 style="font-size: 24px; margin: 0 0 20px 0; color: #003366;">New Reservation for ${event.name}</h2>
                                                  <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">A new reservation has been made:</p>
                                                  <ul style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">
                                                      <li>Event: ${event.name}</li>
                                                      <li>Customer: ${reservation.user.name}</li>
                                                      <li>Ticket Type: ${ticketType}</li>
                                                      <li>Number of Tickets: ${reservation.numberOfPeople}</li>
                                                      <li>Amount Paid: ${reservation.paidAmmount}</li>                                                      
                                                      <li>Remaining Tickets: ${event.remainingTickets}</li>
                                                  </ul>                                                 
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
                                                  <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2024 PLAN-A<br/></p>
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
            to: recipientEmail,
            subject: `New Reservation for ${event.name}`,
            html: htmlContent
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('New reservation notification sent: ' + info.response);
            return true;
        } catch (error) {
            console.error('Error sending new reservation notification:', error);
            return false;
        }
    }


    //banned ,ail
    async sendAccountDisabledNotification(userEmail: string, userName: string) {
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Important Notice: Your Account Status</title>
              <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background-color: #003366; color: white; padding: 20px; text-align: center; }
                  .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
                  .footer { text-align: center; margin-top: 20px; font-size: 0.9em; color: #666; }
                  .button { display: inline-block; padding: 10px 20px; background-color: #003366; color: white; text-decoration: none; border-radius: 5px; }
              </style>
          </head>
          <body>
              <div class="header">
                  <h1>Important Notice: Your Account Status</h1>
              </div>
              <div class="content">
                  <p>Dear ${userName},</p>
                  <p>We hope this email finds you well. We regret to inform you that your account on PLAN-A has been temporarily disabled due to a potential violation of our community guidelines or terms of service.</p>
                  <p>We understand that this may be concerning, and we want to assure you that you have the right to appeal this decision. We value your participation in our community and are committed to reviewing each case thoroughly.</p>
                  <h2>How to Appeal:</h2>
                  <ol>
                      <li>Click on the "Submit Appeal" button below</li>
                      <li>Log in to your account (you can still access the appeal form)</li>
                      <li>Fill out the appeal form, providing as much detail as possible about your situation</li>
                      <li>Submit your appeal for review</li>
                  </ol>
                  <p>Our team will carefully review your appeal and respond within 3-5 business days. We appreciate your patience during this process.</p>
                  <p style="text-align: center;">
                      <a href="${process.env.FRONTEND_URL}/appeal" class="button">Submit Appeal</a>
                  </p>
                  <p>If you have any questions or need further assistance, please don't hesitate to contact our support team at support@plan-a.com.</p>
                  <p>We look forward to resolving this matter and potentially welcoming you back to our community.</p>
                  <p>Best regards,<br>The PLAN-A Team</p>
              </div>
              <div class="footer">
                  <p>This is an automated message. Please do not reply directly to this email.</p>
              </div>
          </body>
          </html>
        `;

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: userEmail,
            subject: 'Important Notice: Your PLAN-A Account Status',
            html: htmlContent
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Account disabled notification sent: ' + info.response);
            return true;
        } catch (error) {
            console.error('Error sending account disabled notification:', error);
            return false;
        }
    }


    //restired acc
    async sendAccountReactivatedNotification(userEmail: string, userName: string) {
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Your Account Has Been Reactivated</title>
              <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                  .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
                  .footer { text-align: center; margin-top: 20px; font-size: 0.9em; color: #666; }
                  .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
              </style>
          </head>
          <body>
              <div class="header">
                  <h1>Your Account Has Been Reactivated</h1>
              </div>
              <div class="content">
                  <p>Dear ${userName},</p>
                  <p>We are pleased to inform you that your PLAN-A account has been successfully reactivated. You now have full access to all features and services on our platform.</p>
                  <p>We appreciate your patience during the review process and thank you for your continued interest in being part of our community.</p>
                  <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
                  <p style="text-align: center;">
                      <a href="${process.env.FRONTEND_URL}/login" class="button">Log In to Your Account</a>
                  </p>
                  <p>We look forward to seeing you back on PLAN-A!</p>
                  <p>Best regards,<br>The PLAN-A Team</p>
              </div>
              <div class="footer">
                  <p>This is an automated message. Please do not reply directly to this email.</p>
              </div>
          </body>
          </html>
        `;

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: userEmail,
            subject: 'Welcome Back! Your PLAN-A Account Has Been Reactivated',
            html: htmlContent
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Account reactivation notification sent: ' + info.response);
            return true;
        } catch (error) {
            console.error('Error sending account reactivation notification:', error);
            return false;
        }
    }


    //appeal mail
    async sendAppealNotificationToAdmin(adminEmail: string, appealDetails: any) {
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New User Appeal Submitted</title>
              <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background-color: #003366; color: white; padding: 20px; text-align: center; }
                  .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
                  .footer { text-align: center; margin-top: 20px; font-size: 0.9em; color: #666; }
                  .button { display: inline-block; padding: 10px 20px; background-color: #003366; color: white; text-decoration: none; border-radius: 5px; }
              </style>
          </head>
          <body>
              <div class="header">
                  <h1>New User Appeal Submitted</h1>
              </div>
              <div class="content">
                  <p>A new appeal has been submitted. Details are as follows:</p>
                  <h2>User Information:</h2>
                  <ul>
                      <li><strong>User ID:</strong> ${appealDetails.userId}</li>
                      <li><strong>Name:</strong> ${appealDetails.userName}</li>
                      <li><strong>Email:</strong> ${appealDetails.userEmail}</li>
                      <li><strong>Role:</strong> ${appealDetails.userRole}</li>
                  </ul>
                  <h2>Appeal Details:</h2>
                  <ul>
                      <li><strong>Appeal ID:</strong> ${appealDetails.appealId}</li>
                      <li><strong>Reason:</strong> ${appealDetails.reason}</li>
                      <li><strong>Details:</strong> ${appealDetails.details}</li>
                      <li><strong>Submitted at:</strong> ${appealDetails.createdAt}</li>
                  </ul>
                  <p>Please review this appeal at your earliest convenience.</p>
                  <p style="text-align: center;">
                      <a href="${process.env.FRONTEND_URL}/admin/appeals/${appealDetails.appealId}" class="button">Review Appeal</a>
                  </p>
              </div>
              <div class="footer">
                  <p>This is an automated message from the PLAN-A system.</p>
              </div>
          </body>
          </html>
        `;

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: adminEmail,
            subject: 'New User Appeal Submitted - Action Required',
            html: htmlContent
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Appeal notification sent to admin: ' + info.response);
            return true;
        } catch (error) {
            console.error('Error sending appeal notification to admin:', error);
            return false;
        }
    }

    //password reset
    async sendPasswordResetEmail(email: string, resetCode: string) {
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Password Reset Request</title>
              <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background-color: #003366; color: white; padding: 20px; text-align: center; }
                  .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
                  .footer { text-align: center; margin-top: 20px; font-size: 0.9em; color: #666; }
                  .reset-code { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; letter-spacing: 5px; }
              </style>
          </head>
          <body>
              <div class="header">
                  <h1>Password Reset Request</h1>
              </div>
              <div class="content">
                  <p>You have requested to reset your password. Use the following code to complete the process:</p>
                  <p class="reset-code">${resetCode}</p>
                  <p>This code will expire in 1 hour.</p>
                  <p>If you didn't request this reset, please ignore this email or contact support if you have concerns.</p>
              </div>
              <div class="footer">
                  <p>This is an automated message from PLAN-A. Please do not reply to this email.</p>
              </div>
          </body>
          </html>
        `;

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Password Reset Request - PLAN-A',
            html: htmlContent
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Password reset email sent: ' + info.response);
            return true;
        } catch (error) {
            console.error('Error sending password reset email:', error);
            return false;
        }
    }


    async sendAccountVerificationEmail(email: string, userName: string) {
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Verification Approved</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #003366; color: white; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
                    .footer { text-align: center; margin-top: 20px; font-size: 0.9em; color: #666; }
                    .button { display: inline-block; padding: 10px 20px; background-color: #003366; color: white; text-decoration: none; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Account Verification Approved</h1>
                </div>
                <div class="content">
                    <p>Dear ${userName},</p>
                    <p>We are pleased to inform you that your PLAN-A account has been successfully verified and upgraded to manager status.</p>
                    <p>As a manager, you now have access to additional features and responsibilities on our platform, including:</p>
                    <ul>
                        <li>Creating and managing events</li>
                        <li>Accessing detailed analytics</li>
                        <li>Managing team members</li>
                    </ul>
                    <p>We encourage you to explore these new capabilities and make the most of your enhanced role.</p>
                    <p style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Access Your Dashboard</a>
                    </p>
                    <p>If you have any questions about your new role or need assistance, please don't hesitate to contact our support team.</p>
                    <p>Thank you for your commitment to PLAN-A. We look forward to your continued success on our platform!</p>
                    <p>Best regards,<br>The PLAN-A Team</p>
                </div>
                <div class="footer">
                    <p>This is an automated message. Please do not reply directly to this email.</p>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'PLAN-A Account Verification Approved',
            html: htmlContent
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Account verification email sent: ' + info.response);
            return true;
        } catch (error) {
            console.error('Error sending account verification email:', error);
            return false;
        }
    }



    async sendManagerRequestNotification(adminEmail: string, user: User) {
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Manager Account Request</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #003366; color: white; padding: 10px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
                    .button { display: inline-block; padding: 10px 20px; background-color: #003366; color: white; text-decoration: none; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>New Manager Account Request</h1>
                    </div>
                    <div class="content">
                        <p>A user has requested to upgrade their account to manager status:</p>
                        <ul>
                            <li>Name: ${user.name}</li>
                            <li>Email: ${user.email}</li>
                            <li>Phone number: ${user.phoneNumber}</li>
                        </ul>
                        <p>Please review this request and take appropriate action.</p>
                        <a href="${process.env.FRONTEND_URL}/admin/user/${user}" class="button">Review Request</a>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: adminEmail,
            subject: 'New Manager Account Request',
            html: htmlContent
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Manager request notification sent: ' + info.response);
            return true;
        } catch (error) {
            console.error('Error sending manager request notification:', error);
            return false;
        }
    }

    async sendCancellationEmail(userEmail: string, userName: string, eventName: string, refundAmount: number, feeAmount: number) {
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reservation Cancellation Confirmation</title>
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
                                                    <h2 style="font-size: 24px; margin: 0 0 20px 0; color: #003366;">Hello ${userName},</h2>
                                                    <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Your reservation for the event "${eventName}" has been successfully cancelled.</p>
                                                    <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Refund Details:</p>
                                                    <ul style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">
                                                        <li>Refund Amount: Ksh${refundAmount.toFixed(2)}</li>
                                                        <li>Processing Fee: Ksh${feeAmount.toFixed(2)}</li>
                                                    </ul>
                                                    <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">The refund has been credited to your wallet. We hope to see you at future events!</p>
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
                                                    <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2024 PLAN-A<br/></p>
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
            to: userEmail,
            subject: 'Reservation Cancellation Confirmation',
            html: htmlContent
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Cancellation confirmation email sent: ' + info.response);
            return true;
        } catch (error) {
            console.error('Error sending cancellation confirmation email:', error);
            return false;
        }
    }

    async sendCancellationNotificationToManager(managerEmail: string, managerName: string, eventName: string, userName: string) {
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reservation Cancellation Notification</title>
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
                                                    <h2 style="font-size: 24px; margin: 0 0 20px 0; color: #003366;">Hello ${managerName},</h2>
                                                    <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">A reservation for your event "${eventName}" has been cancelled.</p>
                                                    <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">Cancellation Details:</p>
                                                    <ul style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">
                                                        <li>Event: ${eventName}</li>
                                                        <li>User: ${userName}</li>
                                                    </ul>
                                                    <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px;">The ticket(s) have been returned to the available pool.</p>
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
                                                    <p style="margin: 0; font-size: 14px; line-height: 16px; color: #ffffff;">&copy; 2024 PLAN-A<br/></p>
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
            subject: 'Reservation Cancellation Notification',
            html: htmlContent
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Cancellation notification email sent to manager: ' + info.response);
            return true;
        } catch (error) {
            console.error('Error sending cancellation notification email to manager:', error);
            return false;
        }
    }







}

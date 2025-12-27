import nodemailer from "nodemailer";
import { config } from "../config/index.config";

export const sendMail = async (
  recepient: string,
  subject: string,
  message: string,
  html?: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.gmail.user,
      pass: config.gmail.password,
    },
  });

  const mailOptions = {
    from: `"RemediX" ${config.gmail.user}`,
    to: recepient,
    subject: subject,
    text: message,
    html: html,
  };

  // 3. Send the Email
  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Email not sent");
  }
};

export const sendConsultationSuccessfulMail = (
  recipient: string,
  details: any
) => {
  const message = `<!DOCTYPE html>
<html>
<head>
  <style>
    /* Basic resets */
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee; }
    .header h2 { color: #333333; margin: 0; }
    .content { padding: 20px 0; color: #555555; line-height: 1.6; }
    .details-box { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50; }
    .detail-row { margin-bottom: 10px; }
    .detail-label { font-weight: bold; color: #333333; width: 100px; display: inline-block; }
    .button-container { text-align: center; margin-top: 30px; }
    .btn { background-color: #4CAF50; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; }
    .footer { text-align: center; font-size: 12px; color: #999999; margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Appointment Confirmed</h2>
    </div>
    
    <div class="content">
      <p>Dear <strong>${details.patientName}</strong>,</p>
      <p>Your consultation has been successfully booked. We have reserved this time slot specifically for you.</p>
      
      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">Doctor:</span> Dr. ${details.doctorName}
        </div>
        <div class="detail-row">
          <span class="detail-label">Date:</span> ${details.date}
        </div>
        <div class="detail-row">
          <span class="detail-label">Time:</span> ${details.startTime} - ${
    details.endTime
  }
        </div>
      </div>

      <div class="button-container">
        <a href="${details.meetingLink}" class="btn">Join Meeting</a>
      </div>

      <p style="font-size: 14px; margin-top: 20px;">
        *Please try to join 5 minutes early to test your audio and video.
      </p>
    </div>

    <div class="footer">
      <p>Need to reschedule? Log in to your dashboard.</p>
      <p>&copy; ${new Date().getFullYear()} Your Clinic Name. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

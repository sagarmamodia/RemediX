import nodemailer from "nodemailer";
import { config } from "../config/index.config";
import { getISTDetails } from "./date";

export const sendMail = async (
  recepient: string,
  subject: string,
  message: { text?: string; html?: string }
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
      user: config.gmail.user,
      pass: config.gmail.password,
    },
  });

  const mailOptions = {
    from: `"RemediX" ${config.gmail.user}`,
    to: recepient,
    subject: subject,
    text: message.text,
    html: message.html,
  };

  // 3. Send the Email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[INFO] Email sent successfully`);
  } catch (error) {
    console.log(error);
    console.log(`[ERROR] Email not sent`);
  }
};

export const sendConsultationMailToPatient = async (
  recepient: string,
  patientName: string,
  doctorName: string,
  startTime: Date,
  endTime: Date
) => {
  try {
    const startTimeIST = getISTDetails(startTime);
    const endTimeIST = getISTDetails(endTime);
    const begin = `${startTimeIST.hour}:${startTimeIST.minute}`;
    const end = `${endTimeIST.hour}:${endTimeIST.minute}`;
    const date = `${startTimeIST.day} ${startTimeIST.month} ${startTimeIST.year}`;
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
      <h2>Consultation Confirmed</h2>
    </div>
    
    <div class="content">
      <p>Dear <strong>${patientName}</strong>,</p>
      <p>Your consultation has been successfully booked. We have reserved this time slot specifically for you.</p>
      
      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">Doctor:</span> Dr. ${doctorName}
        </div>
        <div class="detail-row">
          <span class="detail-label">Date:</span> ${date}
        </div>
        <div class="detail-row">
          <span class="detail-label">Time:</span> ${begin} - ${end}
        </div>
      </div>


      <p style="font-size: 14px; margin-top: 20px;">
        *Please try to join 5 minutes early to test your audio and video.
      </p>
    </div>
  </div>
</body>
</html>
  `;

    // send the mail
    const subject = "Consultation confirmed";
    await sendMail(recepient, subject, { html: message });
  } catch (err) {
    console.log("[ERROR] Email not sent");
  }
};

export const sendConsultationMailToDoctor = async (
  recepient: string,
  patientName: string,
  doctorName: string,
  startTime: Date,
  endTime: Date
) => {
  try {
    const startTimeIST = getISTDetails(startTime);
    const endTimeIST = getISTDetails(endTime);
    const begin = `${startTimeIST.hour}:${startTimeIST.minute}`;
    const end = `${endTimeIST.hour}:${endTimeIST.minute}`;
    const date = `${startTimeIST.day} ${startTimeIST.month} ${startTimeIST.year}`;
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
      <h2>Consultation Confirmed</h2>
    </div>
    
    <div class="content">
      <p>Dear <strong>${doctorName}</strong>,</p>
      <p>Your consultation has been successfully booked. We have reserved this time slot specifically for you.</p>
      
      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">Patient:</span> Dr. ${patientName}
        </div>
        <div class="detail-row">
          <span class="detail-label">Date:</span> ${date}
        </div>
        <div class="detail-row">
          <span class="detail-label">Time:</span> ${begin} - ${end}
        </div>
      </div>


      <p style="font-size: 14px; margin-top: 20px;">
        *Please try to join 5 minutes early to test your audio and video.
      </p>
    </div>
  </div>
</body>
</html>
  `;

    // send the mail
    const subject = "Consultation confirmed";
    await sendMail(recepient, subject, { html: message });
  } catch (err) {
    console.log("[ERROR] Email not sent");
  }
};

export const sendRescheduleEmailToPatient = async (
  recepient: string,
  patientName: string,
  doctorName: string,
  startTime: Date,
  endTime: Date
) => {
  try {
    const startTimeIST = getISTDetails(startTime);
    const endTimeIST = getISTDetails(endTime);
    const begin = `${startTimeIST.hour}:${startTimeIST.minute}`;
    const end = `${endTimeIST.hour}:${endTimeIST.minute}`;
    const date = `${startTimeIST.day} ${startTimeIST.month} ${startTimeIST.year}`;
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
      <h2>Consultation Rescheduled</h2>
    </div>
    
    <div class="content">
      <p>Dear <strong>${patientName}</strong>,</p>
      <p>Your consultation has been successfully rescheduled.</p>
      
      <div class="details-box">
        <h2> Updated consultation details </h2>
        <div class="detail-row">
          <span class="detail-label">Doctor:</span> Dr. ${doctorName}
        </div>
        <div class="detail-row">
          <span class="detail-label">Date:</span> ${date}
        </div>
        <div class="detail-row">
          <span class="detail-label">Time:</span> ${begin} - ${end}
        </div>
      </div>


      <p style="font-size: 14px; margin-top: 20px;">
        *Please try to join 5 minutes early to test your audio and video.
      </p>
    </div>
  </div>
</body>
</html>
  `;

    // send the mail
    const subject = "Consultation confirmed";
    await sendMail(recepient, subject, { html: message });
  } catch (err) {
    console.log("[ERROR] Email not sent");
  }
};

export const sendRescheduleEmailToDoctor = async (
  recepient: string,
  patientName: string,
  doctorName: string,
  startTime: Date,
  endTime: Date
) => {
  const startTimeIST = getISTDetails(startTime);
  const endTimeIST = getISTDetails(endTime);
  const begin = `${startTimeIST.hour}:${startTimeIST.minute}`;
  const end = `${endTimeIST.hour}:${endTimeIST.minute}`;
  const date = `${startTimeIST.day} ${startTimeIST.month} ${startTimeIST.year}`;
  try {
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
      <h2>Consultation Rescheduled</h2>
    </div>
    
    <div class="content">
      <p>Dear <strong>${patientName}</strong>,</p>
      <p>Your consultation has been successfully rescheduled.</p>
      
      <div class="details-box">
        <h2> Updated consultation details </h2>
        <div class="detail-row">
          <span class="detail-label">Doctor:</span> Dr. ${doctorName}
        </div>
        <div class="detail-row">
          <span class="detail-label">Date:</span> ${date}
        </div>
        <div class="detail-row">
          <span class="detail-label">Time:</span> ${begin} - ${end}
        </div>
      </div>


      <p style="font-size: 14px; margin-top: 20px;">
        *Please try to join 5 minutes early to test your audio and video.
      </p>
    </div>
  </div>
</body>
</html>
  `;

    // send the mail
    const subject = "Consultation confirmed";
    await sendMail(recepient, subject, { html: message });
  } catch (err) {
    console.log("[ERROR] Email not sent");
  }
};

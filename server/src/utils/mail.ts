import nodemailer from "nodemailer";
import { config } from "../config/index.config";

export const sendMail = async (
  recepient: string,
  subject: string,
  message: string
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
  };

  // 3. Send the Email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[INFO] Message sent to ${recepient}: %s`, info.messageId);
  } catch (error) {
    console.log(`[ERROR] Error sending email to ${recepient} `);
  }
};

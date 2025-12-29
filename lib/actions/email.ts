"use server";

import nodemailer from "nodemailer";

// Hardcoded recipient email - change this to your desired email address
const RECIPIENT_EMAIL = process.env.SMTP_EMAIL || "ivan.mihailov37@gmail.com";

async function send({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  if (!SMTP_EMAIL || !SMTP_PASSWORD) {
    throw new Error("SMTP credentials are not configured");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    const testResult = await transporter.verify();
    console.log("SMTP connection verified:", testResult);
  } catch (error) {
    console.error("SMTP verification failed:", error);
    throw error;
  }

  try {
    const sendRequest = await transporter.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      text: text,
    });
    console.log("Email sent successfully:", sendRequest);
    return sendRequest;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export default async function sendEmail({
  subject,
  text,
  fromName,
  fromEmail,
}: {
  subject?: string;
  text: string;
  fromName: string;
  fromEmail: string;
}) {
  // Use hardcoded recipient email
  const to = RECIPIENT_EMAIL;
  const emailSubject = subject || `Ново запитване от ${fromName}`;

  return await send({ to, subject: emailSubject, text });
}

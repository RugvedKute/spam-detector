import nodemailer from "nodemailer";

const sendMail = async (email, subject, otp) => {
  try {
    console.log("Sending email to:", email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: "kuterugved09@gmail.com",
      to: email,
      subject: subject,
      text: `The OTP to verify the spam detector is ${otp}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export { sendMail };

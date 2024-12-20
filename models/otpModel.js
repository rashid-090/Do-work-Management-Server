import mongoose from "mongoose";
import { sendOTPMail } from "../utils/mailFunction.js";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, //Expire in 5 minute
  },
});

async function sendVerificationEmail(email, otp) {
  try {
    sendOTPMail(email, otp);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}
otpSchema.pre("save", async function (next) {
  console.log("New document saved to the database");

  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});




const OtpModel = mongoose.model('OTP', otpSchema);
export default OtpModel;


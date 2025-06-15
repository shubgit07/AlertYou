import User from "../models/User.models.js";
import nodemailer from "nodemailer";

export const sendAlerts = async (req, res) => {
    const { name, age, userEmail, location, familyContact, message, latitude, longitude } = req.body;

    // Save to database first
    try {
      const newUser = new User({ 
        name, 
        age, 
        userEmail, 
        location, 
        latitude, 
        longitude, 
        familyContact, 
        message 
      });
      await newUser.save();
      console.log("✅ Data saved to database successfully");
    } catch (error) {
      console.error("❌ Database error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Error saving user data." 
      });
    }
    
    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS
      }
    });
    
    // Send email
    try {
      const info = await transporter.sendMail({
        from: `"Alertly App" <${process.env.SMTP_EMAIL}>`,
        to: familyContact,
        replyTo: userEmail, 
        subject: "🚨 Emergency Alert 🚨",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: red;">Emergency Alert from ${name} 🚨</h2>
            <p><strong>${name}</strong> has triggered an emergency alert.</p>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Precise Location:</strong> 
              <a href="https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}" 
                 style="color: #1a73e8;" target="_blank">
                View Exact Location on Google Maps (${latitude}, ${longitude})
              </a>
            </p>
            ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
            <p style="color: gray;">Please contact them immediately.</p>
          </div>
        `
      });
      
      console.log("✅ Email sent successfully:", info.messageId);
      
      // Send single success response
      res.status(200).json({ 
        success: true,
        message: "Emergency alert sent to family members!",
        messageId: info.messageId
      });
      
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      res.status(500).json({ 
        success: false,
        message: "Error sending alert.",
        error: error.message
      });
    }
};

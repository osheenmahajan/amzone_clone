const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.init(); // Boot ethereal account
  }

  async init() {
    // 1. Check if the user has provided real Gmail credentials in the .env
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
       console.log('Live email credentials detected. Routing natively through Gmail SMTP...');
       this.transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
           user: process.env.EMAIL_USER,
           pass: process.env.EMAIL_PASS,
         }
       });
       return;
    }

    // 2. Otherwise fallback to the testing network
    try {
      console.log('No live SMTP configuration detected in .env, falling back to temporary Ethereal mock...');
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // Ethereal routes over 587
        auth: {
          user: testAccount.user, 
          pass: testAccount.pass, 
        },
      });
    } catch (e) {
      console.error('Nodemailer init failed:', e);
    }
  }

  async sendOrderConfirmationEmail(userEmail, orderId, totalAmount, shippingAddress) {
    if (!this.transporter) return null;
    try {
      const formattedTotal = parseFloat(totalAmount).toFixed(2);
      
      const info = await this.transporter.sendMail({
        from: '"Amazon Clone" <auto-confirm@amazonclone.in>',
        to: userEmail,
        subject: `Your Amazon.in order confirmation (#${orderId})`,
        html: `
          <div style="font-family: 'Inter', Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: 0 auto; color: #111;">
            <h2 style="color: #FF9900; margin-bottom: 5px;">Amazon<span style="color: #232F3E;">.in</span></h2>
            <h3 style="color: #007600; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Confirmation</h3>
            <p>Hello,</p>
            <p>Thank you for shopping with us! We have received your order and are currently preparing it for shipment.</p>
            <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border: 1px solid #eaeded; border-radius: 5px;">
              <p style="margin: 0 0 10px 0;"><strong>Order ID:</strong> 114-${String(orderId).padStart(7, '0')}-983${orderId}</p>
              <p style="margin: 0 0 10px 0;"><strong>Total Billed:</strong> <span style="color: #B12704; font-weight: bold;">$${formattedTotal}</span></p>
              <p style="margin: 0;"><strong>Delivering To:</strong> ${shippingAddress}</p>
            </div>
            <p style="color: gray; font-size: 13px;">We'll send another automated update when your items ship.</p>
          </div>
        `,
      });

      // Returns the ethereal preview portal URL for debugging mock apps without exposing real user emails
      return nodemailer.getTestMessageUrl(info);
    } catch (error) {
      console.error("Error dispatching email dynamically:", error);
      return null;
    }
  }
}

module.exports = new EmailService();

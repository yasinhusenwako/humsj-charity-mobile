/**
 * Email Template Generators
 * Creates HTML email templates for different purposes
 */

/**
 * Generate monthly donation email
 */
exports.generateMonthlyEmail = ({ name, amount, causeName, quote, quoteSource }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; }
    .quote-box { background: white; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 5px; }
    .amount { font-size: 32px; font-weight: bold; color: #10b981; }
    .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌙 JazakAllah Khair</h1>
      <p>May Allah reward you with goodness</p>
    </div>
    
    <div class="content">
      <h2>Assalamu Alaikum ${name},</h2>
      
      <p>Alhamdulillah! Your monthly donation has been processed successfully.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="margin: 0; color: #6b7280;">Your Donation</p>
        <p class="amount">${amount} ETB</p>
        <p style="color: #6b7280;">to ${causeName}</p>
      </div>
      
      <p>Your generosity continues to make a real difference in the lives of Muslim students at Haramaya University. Through your support, students can focus on their education without the burden of financial stress.</p>
      
      <div class="quote-box">
        <p style="font-style: italic; margin: 0; font-size: 16px;">"${quote}"</p>
        <p style="text-align: right; color: #6b7280; margin-top: 10px; font-size: 14px;">— ${quoteSource}</p>
      </div>
      
      <p><strong>Impact of Your Donation:</strong></p>
      <ul>
        <li>Supporting students' education and living expenses</li>
        <li>Building a stronger Muslim community</li>
        <li>Earning continuous rewards (Sadaqah Jariyah)</li>
        <li>Helping students achieve their dreams</li>
      </ul>
      
      <p>May Allah accept your charity and multiply your rewards. Your contribution is not just financial support—it's an investment in the future of our Ummah.</p>
      
      <p style="margin-top: 30px;">Barakallahu Feek,<br><strong>HUMSJ Charity Team</strong></p>
    </div>
    
    <div class="footer">
      <p>Haramaya University Muslim Students' Jama'a</p>
      <p style="font-size: 12px; margin-top: 10px;">This is an automated monthly donation receipt. If you have any questions, please contact us.</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Generate welcome email for new subscribers
 */
exports.generateWelcomeEmail = ({ name, amount, causeName, quote, quoteSource }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; }
    .quote-box { background: white; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 5px; }
    .amount { font-size: 32px; font-weight: bold; color: #10b981; }
    .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
    .welcome-badge { background: #10b981; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to HUMSJ Charity!</h1>
      <p>Barakallahu Feek - May Allah bless you</p>
    </div>
    
    <div class="content">
      <h2>Assalamu Alaikum ${name},</h2>
      
      <div style="text-align: center;">
        <div class="welcome-badge">✨ New Monthly Donor ✨</div>
      </div>
      
      <p>Alhamdulillah! We are honored to welcome you to our community of monthly donors. Your decision to support Muslim students at Haramaya University is a beautiful act of faith and compassion.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="margin: 0; color: #6b7280;">Your Monthly Contribution</p>
        <p class="amount">${amount} ETB</p>
        <p style="color: #6b7280;">to ${causeName}</p>
      </div>
      
      <div class="quote-box">
        <p style="font-style: italic; margin: 0; font-size: 16px;">"${quote}"</p>
        <p style="text-align: right; color: #6b7280; margin-top: 10px; font-size: 14px;">— ${quoteSource}</p>
      </div>
      
      <p><strong>What Happens Next?</strong></p>
      <ul>
        <li>Your monthly donation will be processed automatically</li>
        <li>You'll receive a monthly email with updates and inspiration</li>
        <li>You can view your donation history anytime in your account</li>
        <li>You can modify or cancel your subscription at any time</li>
      </ul>
      
      <p><strong>Your Impact:</strong></p>
      <p>With your ${amount} ETB monthly donation, you're helping provide:</p>
      <ul>
        <li>Educational materials and books</li>
        <li>Nutritious meals for students</li>
        <li>Safe housing and accommodation</li>
        <li>Emergency support for students in need</li>
      </ul>
      
      <p>Remember, the Prophet Muhammad (ﷺ) said: <em>"When a person dies, all their deeds end except three: a continuing charity, beneficial knowledge and a child who prays for them."</em></p>
      
      <p>Your monthly donation is a form of Sadaqah Jariyah (continuous charity) that will continue to benefit others and earn you rewards, insha'Allah.</p>
      
      <p style="margin-top: 30px;">May Allah accept your charity, increase your provision, and grant you Jannah al-Firdaus.</p>
      
      <p>Barakallahu Feek,<br><strong>HUMSJ Charity Team</strong></p>
    </div>
    
    <div class="footer">
      <p>Haramaya University Muslim Students' Jama'a</p>
      <p style="font-size: 12px; margin-top: 10px;">Questions? Contact us anytime. We're here to help!</p>
    </div>
  </div>
</body>
</html>
  `;
};

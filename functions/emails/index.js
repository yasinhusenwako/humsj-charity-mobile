/**
 * Email Functions
 * Handles welcome emails and monthly donation reminders
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const { getRandomQuote } = require("../utils/quotes");
const {
  generateMonthlyEmail,
  generateWelcomeEmail,
} = require("../utils/emailTemplates");

// Configure SendGrid
// NOTE: Set these in Firebase config: firebase functions:config:set sendgrid.key="your-sendgrid-api-key"
sgMail.setApiKey(
  functions.config().sendgrid?.key || process.env.SENDGRID_API_KEY
);

// Fallback to Gmail if SendGrid not configured
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().email?.user || process.env.EMAIL_USER,
    pass: functions.config().email?.pass || process.env.EMAIL_PASS,
  },
});

/**
 * Scheduled function: Runs on the last day of every month
 * Sends monthly donation emails to all active subscribers
 */
exports.sendMonthlyEmails = functions.pubsub
  .schedule("0 9 28-31 * *") // Run at 9 AM on days 28-31 of every month
  .timeZone("Africa/Addis_Ababa")
  .onRun(async (context) => {
    try {
      const db = admin.firestore();

      // Check if today is the last day of the month
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (tomorrow.getMonth() === today.getMonth()) {
        console.log("Not the last day of the month, skipping...");
        return null;
      }

      console.log("Running monthly email campaign...");

      // Get all active subscriptions
      const subscriptionsSnapshot = await db
        .collection("subscriptions")
        .where("active", "==", true)
        .get();

      if (subscriptionsSnapshot.empty) {
        console.log("No active subscriptions found");
        return null;
      }

      const emailPromises = [];

      for (const doc of subscriptionsSnapshot.docs) {
        const subscription = doc.data();
        const quote = await getRandomQuote();

        // Record monthly donation
        await db.collection("donations").add({
          userId: subscription.userId,
          userName: subscription.userName,
          userEmail: subscription.userEmail,
          amount: subscription.amount,
          causeId: subscription.causeId,
          causeName: subscription.causeName,
          type: "monthly",
          subscriptionId: doc.id,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          status: "completed",
        });

        // Update cause amount if specified
        if (subscription.causeId) {
          const causeRef = db.collection("causes").doc(subscription.causeId);
          const causeDoc = await causeRef.get();

          if (causeDoc.exists) {
            const causeData = causeDoc.data();
            const newRaised = (causeData.raised || 0) + subscription.amount;
            const newProgress = Math.round((newRaised / causeData.goal) * 100);

            await causeRef.update({
              raised: newRaised,
              progress: newProgress,
            });
          }
        }

        // Generate and send email
        const emailHtml = generateMonthlyEmail({
          name: subscription.userName,
          amount: subscription.amount,
          causeName: subscription.causeName,
          quote: quote.text,
          quoteSource: quote.source,
        });

        const mailOptions = {
          from:
            functions.config().sendgrid?.from ||
            functions.config().email?.user ||
            "noreply@humsjcharity.org",
          to: subscription.userEmail,
          subject: "JazakAllah Khair - Your Monthly Donation",
          html: emailHtml,
        };

        emailPromises.push(
          (functions.config().sendgrid?.key
            ? sgMail.send(mailOptions)
            : transporter.sendMail(mailOptions)
          ).then(async () => {
            // Log email sent
            await db.collection("emailLogs").add({
              userId: subscription.userId,
              email: subscription.userEmail,
              type: "monthly",
              sentAt: admin.firestore.FieldValue.serverTimestamp(),
              quoteUsed: quote.text,
              amount: subscription.amount,
            });
            console.log(`Email sent to ${subscription.userEmail}`);
          })
        );
      }

      await Promise.all(emailPromises);
      console.log(`Monthly emails sent to ${emailPromises.length} subscribers`);

      return null;
    } catch (error) {
      console.error("Error sending monthly emails:", error);
      throw error;
    }
  });

/**
 * Send welcome email when subscription is created
 * Triggered by Firestore onCreate
 */
exports.sendWelcomeEmail = functions.firestore
  .document("subscriptions/{subscriptionId}")
  .onCreate(async (snap, context) => {
    try {
      const subscription = snap.data();
      const quote = await getRandomQuote();

      const emailHtml = generateWelcomeEmail({
        name: subscription.userName,
        amount: subscription.amount,
        causeName: subscription.causeName,
        quote: quote.text,
        quoteSource: quote.source,
      });

      const mailOptions = {
        from:
          functions.config().sendgrid?.from ||
          functions.config().email?.user ||
          "noreply@humsjcharity.org",
        to: subscription.userEmail,
        subject: "Welcome to HUMSJ Monthly Charity - Barakallahu Feek",
        html: emailHtml,
      };

      if (functions.config().sendgrid?.key) {
        await sgMail.send(mailOptions);
      } else {
        await transporter.sendMail(mailOptions);
      }

      // Log email
      await admin.firestore().collection("emailLogs").add({
        userId: subscription.userId,
        email: subscription.userEmail,
        type: "welcome",
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        quoteUsed: quote.text,
      });

      console.log(`Welcome email sent to ${subscription.userEmail}`);
      return null;
    } catch (error) {
      console.error("Error sending welcome email:", error);
      // Don't throw - we don't want to fail subscription creation
      return null;
    }
  });

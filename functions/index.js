/**
 * HUMSJ Charity System - Firebase Cloud Functions
 * Main entry point for all cloud functions
 */

const admin = require("firebase-admin");
admin.initializeApp();

// Import all function modules
const authFunctions = require("./auth");
const subscriptionFunctions = require("./subscriptions");
const emailFunctions = require("./emails");
const galleryFunctions = require("./gallery");
const contactFunctions = require("./contact");

// Export all functions
exports.onUserCreated = authFunctions.onUserCreated;
exports.createSubscription = subscriptionFunctions.createSubscription;
exports.mySubscriptions = subscriptionFunctions.mySubscriptions;
exports.sendMonthlyEmails = emailFunctions.sendMonthlyEmails;
exports.sendWelcomeEmail = emailFunctions.sendWelcomeEmail;
exports.getGallery = galleryFunctions.getGallery;
exports.uploadGalleryImage = galleryFunctions.uploadGalleryImage;
exports.submitContactMessage = contactFunctions.submitContactMessage;

/**
 * Subscription Management Functions
 * Handles monthly donation subscriptions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

const MIN_DONATION_AMOUNT = 50; // Minimum 50 ETB

/**
 * Create a new monthly subscription
 * Validates amount and stores subscription
 */
exports.createSubscription = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Must be authenticated to create subscription"
    );
  }

  const { amount, causeId, causeName } = data;
  const userId = context.auth.uid;

  // Validate amount
  if (!amount || amount < MIN_DONATION_AMOUNT) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      `Minimum donation amount is ${MIN_DONATION_AMOUNT} ETB`
    );
  }

  try {
    const db = admin.firestore();

    // Get user data
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError("not-found", "User not found");
    }

    const userData = userDoc.data();

    // Create subscription
    const subscriptionData = {
      userId,
      userName: userData.name,
      userEmail: userData.email,
      amount,
      causeId: causeId || null,
      causeName: causeName || "General Fund",
      startDate: admin.firestore.FieldValue.serverTimestamp(),
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const subscriptionRef = await db
      .collection("subscriptions")
      .add(subscriptionData);

    // Record initial donation
    await db.collection("donations").add({
      userId,
      userName: userData.name,
      userEmail: userData.email,
      amount,
      causeId: causeId || null,
      causeName: causeName || "General Fund",
      type: "monthly",
      subscriptionId: subscriptionRef.id,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: "completed",
    });

    // Update cause amount if specified
    if (causeId) {
      const causeRef = db.collection("causes").doc(causeId);
      const causeDoc = await causeRef.get();

      if (causeDoc.exists) {
        const causeData = causeDoc.data();
        const newRaised = (causeData.raised || 0) + amount;
        const newProgress = Math.round((newRaised / causeData.goal) * 100);

        await causeRef.update({
          raised: newRaised,
          progress: newProgress,
        });
      }
    }

    return {
      success: true,
      subscriptionId: subscriptionRef.id,
      message: "Subscription created successfully",
    };
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

/**
 * Get user's subscriptions
 */
exports.mySubscriptions = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Must be authenticated"
    );
  }

  try {
    const userId = context.auth.uid;
    const snapshot = await admin
      .firestore()
      .collection("subscriptions")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const subscriptions = [];
    snapshot.forEach((doc) => {
      subscriptions.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return { subscriptions };
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

/**
 * Cancel subscription
 */
exports.cancelSubscription = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Must be authenticated"
    );
  }

  const { subscriptionId } = data;

  try {
    const subscriptionRef = admin
      .firestore()
      .collection("subscriptions")
      .doc(subscriptionId);
    const subscriptionDoc = await subscriptionRef.get();

    if (!subscriptionDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "Subscription not found"
      );
    }

    // Verify ownership
    if (subscriptionDoc.data().userId !== context.auth.uid) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Not authorized"
      );
    }

    await subscriptionRef.update({
      active: false,
      cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, message: "Subscription cancelled" };
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

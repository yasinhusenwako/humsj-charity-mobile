/**
 * Authentication Functions
 * Handles user creation and profile setup
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

/**
 * Trigger: When a new user is created via Firebase Auth
 * Creates user profile in Firestore
 */
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  try {
    const userProfile = {
      name: user.displayName || "",
      email: user.email,
      phone: user.phoneNumber || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      role: "donor", // Default role
    };

    // Store user profile in Firestore
    await admin.firestore().collection("users").doc(user.uid).set(userProfile);

    console.log(`User profile created for ${user.email}`);
    return null;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
});

/**
 * Set admin role for a user (callable function)
 * Only existing admins can call this
 */
exports.setAdminRole = functions.https.onCall(async (data, context) => {
  // Check if caller is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Must be authenticated to set admin role"
    );
  }

  // Check if caller is admin
  const callerDoc = await admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid)
    .get();

  if (!callerDoc.exists || callerDoc.data().role !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can set admin role"
    );
  }

  const { userId } = data;

  try {
    // Set custom claim
    await admin.auth().setCustomUserClaims(userId, { admin: true });

    // Update Firestore
    await admin.firestore().collection("users").doc(userId).update({
      role: "admin",
    });

    return { success: true, message: "Admin role set successfully" };
  } catch (error) {
    console.error("Error setting admin role:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

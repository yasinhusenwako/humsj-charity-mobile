/**
 * Gallery Management Functions
 * Handles image uploads and gallery retrieval
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

/**
 * Get all gallery images
 * Public endpoint - no authentication required
 */
exports.getGallery = functions.https.onCall(async (data, context) => {
  try {
    const snapshot = await admin
      .firestore()
      .collection("gallery")
      .orderBy("createdAt", "desc")
      .get();

    const images = [];
    snapshot.forEach((doc) => {
      images.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return { images };
  } catch (error) {
    console.error("Error fetching gallery:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

/**
 * Upload gallery image (Admin only)
 * Stores metadata in Firestore
 * Actual file upload happens on client side to Firebase Storage
 */
exports.uploadGalleryImage = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Must be authenticated"
    );
  }

  // Check admin role
  const userDoc = await admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid)
    .get();

  if (!userDoc.exists || userDoc.data().role !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can upload gallery images"
    );
  }

  const { imageUrl, caption, title } = data;

  if (!imageUrl) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Image URL is required"
    );
  }

  try {
    const galleryData = {
      imageUrl,
      caption: caption || "",
      title: title || "",
      uploadedBy: context.auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await admin
      .firestore()
      .collection("gallery")
      .add(galleryData);

    return {
      success: true,
      imageId: docRef.id,
      message: "Image uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading gallery image:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

/**
 * Delete gallery image (Admin only)
 */
exports.deleteGalleryImage = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Must be authenticated"
    );
  }

  // Check admin role
  const userDoc = await admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid)
    .get();

  if (!userDoc.exists || userDoc.data().role !== "admin") {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can delete gallery images"
    );
  }

  const { imageId } = data;

  try {
    await admin.firestore().collection("gallery").doc(imageId).delete();

    return {
      success: true,
      message: "Image deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

/**
 * Utility functions for Islamic quotes
 * Fetches random Quran verses and Hadiths
 */

const admin = require("firebase-admin");

/**
 * Get a random quote from the quotes collection
 * @returns {Promise<{text: string, source: string}>}
 */
exports.getRandomQuote = async () => {
  try {
    const db = admin.firestore();
    const quotesSnapshot = await db.collection("quotes").get();

    if (quotesSnapshot.empty) {
      // Return default quote if collection is empty
      return {
        text: "The believer's shade on the Day of Resurrection will be his charity.",
        source: "Hadith - Tirmidhi",
      };
    }

    // Get random quote
    const quotes = [];
    quotesSnapshot.forEach((doc) => {
      quotes.push(doc.data());
    });

    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  } catch (error) {
    console.error("Error fetching quote:", error);
    // Return default quote on error
    return {
      text: "And whatever you spend in good, it will be repaid to you in full, and you shall not be wronged.",
      source: "Quran 2:272",
    };
  }
};

/**
 * Initialize quotes collection with default Islamic quotes
 * Call this once to populate the database
 */
exports.initializeQuotes = async () => {
  const db = admin.firestore();
  const quotesRef = db.collection("quotes");

  const defaultQuotes = [
    {
      text: "The believer's shade on the Day of Resurrection will be his charity.",
      source: "Hadith - Tirmidhi",
    },
    {
      text: "And whatever you spend in good, it will be repaid to you in full, and you shall not be wronged.",
      source: "Quran 2:272",
    },
    {
      text: "Charity does not decrease wealth.",
      source: "Hadith - Sahih Muslim",
    },
    {
      text: "The example of those who spend their wealth in the way of Allah is like a seed of grain that sprouts seven ears; in every ear there are a hundred grains.",
      source: "Quran 2:261",
    },
    {
      text: "Give charity without delay, for it stands in the way of calamity.",
      source: "Hadith - Tirmidhi",
    },
    {
      text: "When a person dies, all their deeds end except three: a continuing charity, beneficial knowledge and a child who prays for them.",
      source: "Hadith - Sahih Muslim",
    },
    {
      text: "Those who spend their wealth in charity day and night, secretly and openly - their reward is with their Lord.",
      source: "Quran 2:274",
    },
    {
      text: "The upper hand is better than the lower hand. The upper hand is the one that gives and the lower hand is the one that receives.",
      source: "Hadith - Bukhari",
    },
    {
      text: "Protect yourself from the Fire even with half a date in charity.",
      source: "Hadith - Bukhari & Muslim",
    },
    {
      text: "Every act of goodness is charity.",
      source: "Hadith - Sahih Muslim",
    },
  ];

  const batch = db.batch();
  defaultQuotes.forEach((quote) => {
    const docRef = quotesRef.doc();
    batch.set(docRef, quote);
  });

  await batch.commit();
  console.log("Quotes collection initialized with default quotes");
};

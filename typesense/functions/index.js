const functions = require("firebase-functions");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Typesense API keys are stored in functions config variables

// Update the search index every time a blog post is written.
exports.onNoteWritten = functions.firestore
  .document("{userId}/{inventoryItem}")
  .onWrite(async (snap, context) => {
    // Use the 'nodeId' path segment as the identifier for Typesense
    const id = context.params.noteId;

    // If the note is deleted, delete the note from the Typesense index
    if (!snap.after.exists) {
      await client.collections("notes").documents(id).delete();
      return;
    }

    // Otherwise, create/update the note in the the Typesense index
    const note = snap.after.data();
    await client.collections("notes").documents().upsert({
      id,
      owner: note.owner,
      text: note.text,
    });
  });

exports.getScopedApiKey = functions.https.onCall(async (data, context) => {
  // Ensure that the user is authenticated with Firebase Auth
  if (!(context.auth && context.auth.uid)) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Must be signed in!"
    );
  }

  // Generate a scoped API key which allows the user to search ONLY
  // documents which belong to them (based on the 'owner' field).
  const scopedApiKey = client
    .keys()
    .generateScopedSearchKey(TYPESENSE_SEARCH_API_KEY, {
      filter_by: `owner:${context.auth.uid}`,
    });

  return {
    key: scopedApiKey,
  };
});

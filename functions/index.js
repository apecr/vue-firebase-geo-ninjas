const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const checkAlias = functions.https.onCall((data, context) => {
  const ref = admin.firestore().collection('users').doc(data.slug);
  return ref.get()
    .then(doc => ({ uniq: !doc.exists }))
    .catch(error => {
      throw new functions.https.HttpsError('failed to connect');
    });
});

module.exports = { checkAlias };
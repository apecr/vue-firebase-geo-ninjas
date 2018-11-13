import firebase from 'firebase';
import firestore from 'firebase/firestore';

var config = {
  apiKey: 'AIzaSyCocj-d58LUS2MIAM1Hk0aUrvVfiXR-ID8',
  authDomain: 'vue-firebase-geo-ninjas.firebaseapp.com',
  databaseURL: 'https://vue-firebase-geo-ninjas.firebaseio.com',
  projectId: 'vue-firebase-geo-ninjas',
  storageBucket: 'vue-firebase-geo-ninjas.appspot.com',
  messagingSenderId: '265135010652'
};
const firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.firestore();

export {
  db
};
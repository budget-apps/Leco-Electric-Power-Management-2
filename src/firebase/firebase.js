import firebase from 'firebase/app';
import 'firebase/auth';

// Use actual config values from registered firbase app
 var firebaseConfig = {
    apiKey: "AIzaSyB2lVrhaBERdvkKP2-yjO5S8xTlesLpL24",
    authDomain: "leco-6db63.firebaseapp.com",
    databaseURL: "https://leco-6db63.firebaseio.com",
    projectId: "leco-6db63",
    storageBucket: "",
    messagingSenderId: "263651431490",
    appId: "1:263651431490:web:b6f1300ba75bb63c"
  };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

export { auth };
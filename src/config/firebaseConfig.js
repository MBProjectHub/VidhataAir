  import firebase from 'firebase';
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC1A5RHwV-ewdTTexwI3M6HITV1-gm-LP4",
    authDomain: "vidhata-dashboard.firebaseapp.com",
    databaseURL: "https://vidhata-dashboard.firebaseio.com",
    projectId: "vidhata-dashboard",
    storageBucket: "vidhata-dashboard.appspot.com",
    messagingSenderId: "889024025063",
    appId: "1:889024025063:web:20e2bcb2c6829992c8ed42",
    measurementId: "G-70YY9CJ9ZM"
  };
  const fire = firebase.initializeApp(config);
  export default fire;
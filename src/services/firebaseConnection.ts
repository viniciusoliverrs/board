import firebase from "firebase/app"
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA2vyJYxhemf251inVrWZvkiO1cYHsY6l0",
  authDomain: "boardapp-f1003.firebaseapp.com",
  projectId: "boardapp-f1003",
  storageBucket: "boardapp-f1003.appspot.com",
  messagingSenderId: "727913893740",
  appId: "1:727913893740:web:9a44f434d182144b55ed49",
  measurementId: "G-QGPP41P6T9"
}

if(!firebase.apps.length) 
  firebase.initializeApp(firebaseConfig)

export default firebase
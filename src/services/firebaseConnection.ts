import firebase from "firebase/app"
import 'firebase/firestore'

const firebaseConfig = [YOUR FIREBASE CONFIG HERE]

if(!firebase.apps.length) 
  firebase.initializeApp(firebaseConfig)

export default firebase
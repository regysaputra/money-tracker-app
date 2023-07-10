// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD9zkBmY5wd2W5nTSzVOGzgJheGPHm2LOw',
  authDomain: 'money-tracker-app-2dc8e.firebaseapp.com',
  projectId: 'money-tracker-app-2dc8e',
  storageBucket: 'money-tracker-app-2dc8e.appspot.com',
  messagingSenderId: '786105713649',
  appId: '1:786105713649:web:b14b09bd4dbab456f7ba50',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export { app, auth, db, storage };

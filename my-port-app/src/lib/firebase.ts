import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  projectId: 'crown-portfolio-271828',
  appId: '1:376675353141:web:f4077eef504daf8a17677c',
  storageBucket: 'crown-portfolio-271828.firebasestorage.app',
  apiKey: 'AIzaSyCZn0xYRUsafPDDtm4dEH2922haltlaqZQ',
  authDomain: 'crown-portfolio-271828.firebaseapp.com',
  messagingSenderId: '376675353141',
}

export const ADMIN_EMAIL = 'shadowninja2.71828@gmail.com'

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBURwXxyQHwhD2sSKuju88iI74674g1QiM",
    authDomain: "upm-clubes.firebaseapp.com",
    projectId: "upm-clubes",
    storageBucket: "upm-clubes.firebasestorage.app",
    messagingSenderId: "733070654554",
    appId: "1:733070654554:web:7050ea09f3baf4e1552c63"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

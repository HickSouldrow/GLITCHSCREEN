import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvZXCKqR3p0tp0FGgUyeuFPKWRi1V56Ig",
  authDomain: "glitchscreen-7bc45.firebaseapp.com",
  databaseURL: "https://glitchscreen-7bc45-default-rtdb.firebaseio.com",
  projectId: "glitchscreen-7bc45",
  storageBucket: "glitchscreen-7bc45.firebasestorage.app",
  messagingSenderId: "159016086975",
  appId: "1:159016086975:web:06959e60d853f50f00050a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços que nós vamos usar
const db = getFirestore(app);

export { db };

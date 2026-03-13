import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCvZXCKqR3p0tp0FGgUyeuFPKWRi1V56Ig",
  authDomain: "glitchscreen-7bc45.firebaseapp.com",
  databaseURL: "https://glitchscreen-7bc45-default-rtdb.firebaseio.com",
  projectId: "glitchscreen-7bc45",
  storageBucket: "glitchscreen-7bc45.firebasestorage.app",
  messagingSenderId: "159016086975",
  appId: "1:159016086975:web:06959e60d853f50f00050a",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços
const db = getFirestore(app);
const database = getDatabase(app);

// Exporta tudo de forma organizada
export { db, database };

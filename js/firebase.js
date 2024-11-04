import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Ваши настройки Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBgJsEfROoAo397QRwBYVuM75u41S4x920",
    authDomain: "gow-teams-84565.firebaseapp.com",
    projectId: "gow-teams-84565",
    storageBucket: "gow-teams-84565.firebasestorage.app",
    messagingSenderId: "1050265954167",
    appId: "1:1050265954167:web:63d8b5be25474c3fd5a372"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
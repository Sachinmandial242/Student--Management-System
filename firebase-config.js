// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWmbHbtn1pUMmWFxtGorfV7KUqrsunzcE",
  authDomain: "student-result-system-df097.firebaseapp.com",
  projectId: "student-result-system-df097",
  storageBucket: "student-result-system-df097.appspot.com", // ✅ comma added
  messagingSenderId: "917085884960",
  appId: "1:917085884960:web:233e67f50a6811fa142245"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// Export
export { db, auth };

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0VH6qjU8FwFug5kdhZx6rY2zjhEMqAEY",
  authDomain: "karsa-tiket-67571.firebaseapp.com",
  projectId: "karsa-tiket-67571",
  storageBucket: "karsa-tiket-67571.firebasestorage.app",
  messagingSenderId: "994075542353",
  appId: "1:994075542353:web:59f25c293ecd3371708970",
  measurementId: "G-ZQT181QL23"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testWrite() {
  console.log("Mencoba menulis event ke Cloud Firestore...");
  try {
    const docRef = await addDoc(collection(db, "event"), {
      nama: "Test Event Konser",
      tanggal: "2026-10-30",
      lokasi: "Jakarta",
      harga: 50000,
      kuota: 100,
      tiket_terjual: 0,
      dibuat_pada: serverTimestamp()
    });
    console.log("SUCCESS! Dokumen tersimpan dengan ID:", docRef.id);
  } catch (err) {
    console.error("ERROR MENULIS:", err.code, err.message);
  }
}

testWrite();

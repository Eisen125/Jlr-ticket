const express = require('express');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const app = express();
const PORT = 3750;

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBRhpeVO88WQSC1b6jibeaKCT-xxH5zZh0",
    authDomain: "jlr-ticket.firebaseapp.com",
    projectId: "jlr-ticket",
    storageBucket: "jlr-ticket.appspot.com",
    messagingSenderId: "735902984093",
    appId: "1:735902984093:web:f91368c783b3017a05b174",
    measurementId: "G-HWMSGK99G1"
  };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Middleware
app.use(express.json());
app.use(cors());

// Endpoint to handle form submission
app.post('/submit-form', async (req, res) => {
  try {
    const formData = req.body;

    // Add form data to Firestore
    const docRef = await addDoc(collection(db, 'forms'), formData);
    console.log('Document written with ID: ', docRef.id);

    res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

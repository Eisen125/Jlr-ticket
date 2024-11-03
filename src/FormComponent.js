import './App.css';
import React, { useState, useRef } from 'react';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRhpeVO88WQSC1b6jibeaKCT-xxH5zZh0",
  authDomain: "jlr-ticket.firebaseapp.com",
  projectId: "jlr-ticket",
  storageBucket: "jlr-ticket.appspot.com",
  messagingSenderId: "735902984093",
  appId: "1:735902984093:web:f91368c783b3017a05b174",
  measurementId: "G-HWMSGK99G1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

const FormComponent = ({ onUpdateData }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const formRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    department: '',
    tat_department: '',
    type_of_problem: '',
    priority: '',
    fileupload: '',
  });

  // Handle select change
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoggedIn(true);
      setError('');
    } catch (error) {
      setError('Failed to login. Please check your credentials.');
      console.error('Error logging in:', error);
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submissionDateTime = new Date();
      const formDataWithTimestamp = {
        ...formData,
        submissionDateTime: submissionDateTime.toISOString(),
      };

      const response = await fetch('https://jlr-ticket.web.app/ticket-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithTimestamp),
      });

      if (response.ok) {
        const docRef = await addDoc(collection(db, 'forms'), {
          ...formDataWithTimestamp,
          submitDate: submissionDateTime.toLocaleDateString(),
          submitTime: submissionDateTime.toLocaleTimeString(),
        });
        console.log('Document written with ID: ', docRef.id);
        alert('נשלח בהצלחה');
        await fetch('https://jlr-ticket.web.app', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email }),
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          description: '',
          fileupload: '',
          department: '',
          tat_department: '',
          type_of_problem: '',
          priority: '',
        });
        setFile(null);
        formRef.current.reset();
      } else {
        throw new Error('Failed to submit form to the server');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please check the console for more details.');
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      try {
        const storageRef = ref(storage, `uploads/${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
        const downloadURL = await getDownloadURL(storageRef);
        console.log('File download URL:', downloadURL);
        setFormData({
          ...formData,
          fileupload: downloadURL,
        });
        setFile(selectedFile);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    alert('הקובץ הועלה בהצלחה');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };
  document.addEventListener('input', (event) => {
    if (event.target.tagName.toLowerCase() === 'textarea') {
        // Adjust textarea height based on content
        event.target.style.height = 'auto';
        event.target.style.height = (event.target.scrollHeight) + 'px';
    }
});

  // const adjustInputWidth = (input) => {
  //   const tempSpan = document.createElement('span');
  //   tempSpan.style.visibility = 'hidden';
  //   tempSpan.style.position = 'absolute';
  //   tempSpan.style.whiteSpace = 'pre';
  //   tempSpan.style.fontSize = getComputedStyle(input).fontSize;
  //   tempSpan.style.fontFamily = getComputedStyle(input).fontFamily;
  //   tempSpan.innerText = input.value || input.placeholder;

  //   document.body.appendChild(tempSpan);
  //   const textWidth = tempSpan.offsetWidth;
  //   input.style.width = (textWidth + 10) + 'px';
  //   document.body.removeChild(tempSpan);
  // };

  return (
    <div className="login-form">
      {!loggedIn ? (
        <div className="container">
          <form className="login-form" onSubmit={handleLogin}>
            <h1>התחברות</h1>
            <div className="form-group">
              <label htmlFor="first_email">:אימייל</label><br></br>
              <input id="first_email" className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="first_password">:סיסמא</label><br></br>
              <input id="first_password" className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button id='login_button' type="submit">התחברות</button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      ) : (
        <div id="myElement">
          <h1>מערכות מידע</h1>
          <h3>פתיחת קריאה</h3>

          <form onSubmit={handleSubmit} ref={formRef} id="MyForm">
            <label htmlFor="name">שם מלא</label>
            <br />
            <input
              type="text"
              name="name"
              id="full_name"
              value={formData.name}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Name"
              autoComplete="off"
            />
            <label htmlFor="email">אימייל</label>
            <br />
            <input
              type="email"
              name="email"
              autoComplete="off"
              value={formData.email}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              id="email"
              placeholder="Email"
            />
            <label htmlFor="phonenumber">טלפון</label>
            <br />
            <input
              type="text"
              name="phone"
              id="phonenumber"
              value={formData.phone}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Phone"
              autoComplete="off"
            />
            <br />
            <label>מחלקה</label>
            <select onChange={handleSelectChange} value={formData.department} id="department" name="department">
              <option value=""></option>
              <option value="כספים">שיווק</option>
              <option value="כספים">שירות </option>
              <option value="כספים">כספים</option>
              <option value="הנהלה">הנהלה</option>
              <option value="שירות לקוחות">שירות לקוחות</option>
              <option value="מוסכים">מוסכים</option>
              <option value="חלפים">חלפים</option>
              <option value="אחזקות">אחזקות</option>
              <option value="Yts">Yts</option>
              <option value="אחר">אחר</option>
            </select>

            <label>תת מחלקה</label>
            <select
              id="tat_department"
              onChange={handleSelectChange}
              value={formData.tat_department}
              name="tat_department"
            >
              <option value=""></option>
              <option value="מוסך כ'ס">מוסך כ'ס</option>
              <option value="מוסך חיפה">מוסך חיפה</option>
              <option value="מוסך תל אביב">מוסך חולון</option>
              <option value="גרינפלד">גרינפלד</option>
              <option value="מרכבה">מרכבה</option>
              <option value="אולם הרצליה">אולם הרצליה</option>
              <option value="אולם ב'ש">אולם ב'ש</option>
              <option value="אולם חיפה">אולם חיפה</option>
              <option value="אולם כ'ס">אולם כ'ס</option>
              <option value="Pdi">Pdi</option>
            </select>
            <label>סוג הבעיה</label>
            <select
              id="type_of_issue"
              onChange={handleSelectChange}
              value={formData.type_of_problem}
              name="type_of_problem"
            >
              <option value=""></option>
              <option value="חומרה-ציוד מחשוב">חומרה-ציוד מחשוב</option>
              <option value="תוכנה-פריוריטי">תוכנה-פריוריטי</option>
              <option value="תוכנה-AS400">תוכנה-AS400</option>
              <option value="תוכנה-אתר יצרן">תוכנה-אתר יצרן</option>
              <option value="בקשת הרשאה">בקשת הרשאה</option>
              <option value="שליפת נתונים">שליפת נתונים</option>
              <option value="אחר">אחר</option>
            </select>
            <label>עדיפות</label>
            <select id="priority" onChange={handleSelectChange} value={formData.priority} name="priority">
              <option value=""></option>
              <option value="רגילה">רגילה</option>
              <option value="בינוני">בינוני</option>
              <option value="דחוף">דחוף</option>
            </select>
            <label htmlFor="description">תיאור בעיה</label>
            <br />
            <textarea
              //  oninput="adjustInputWidth(this)"
              type="text"
              id="description"
              name="description"
              onChange={handleInputChange}
              // onKeyPress={handleKeyPress}
              autoComplete="off"
            />
            <br />
            <br />
            <button type="submit" className="submitbutton">
              אישור
            </button>
            <br />
            <br />
            <label htmlFor="file-upload" className="custom-file-upload">
              <i className="fa fa-cloud-upload"></i> העלאת קובץ
            </label>
            <input id="file-upload" type="file" onChange={handleFileUpload} name="fileupload" autoComplete="off"/>
          </form>
        </div>
      )}
    </div>
  );
}

export default FormComponent;

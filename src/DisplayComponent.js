import React, { useState, useEffect } from 'react';
import './App.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import NavBar from './NavBar';
import { query, orderBy } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyBRhpeVO88WQSC1b6jibeaKCT-xxH5zZh0",
  authDomain: "jlr-ticket.firebaseapp.com",
  projectId: "jlr-ticket",
  storageBucket: "jlr-ticket.appspot.com",
  messagingSenderId: "735902984093",
  appId: "1:735902984093:web:f91368c783b3017a05b174",
  measurementId: "G-HWMSGK99G1"
};

const DisplayComponent = () => {
  const [formDataList, setFormDataList] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedTreater, setSelectedTreater] = useState('כולם'); // State for selected section

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        fetchData(); // Fetch data if logged in
      } else {
        setLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const fetchData = async () => {
    try {
      // Create a query with sorting by submitDate
      const formsQuery = query(collection(db, 'forms'), orderBy('submitDate', 'asc')); // 'asc' for ascending, 'desc' for descending
      
      // Fetch the sorted data
      const formsCollection = await getDocs(formsQuery);
      const formsData = formsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
      setFormDataList(formsData);
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const closeTicket = async (id) => {
    try {
      await updateDoc(doc(db, 'forms', id), {
        isClosed: true
      });
      fetchData(); // Fetch the data again after updating to reflect the changes in UI
    } catch (error) {
      console.error(`Error closing ticket with ID ${id}:`, error);
    }
  };

  const handleInputChange = (id, inputType, value) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [id]: {
        ...prevInputValues[id],
        [inputType]: value,
      },
    }));
  };

  const saveInputToFirestore = async (id) => {
    try {
      await updateDoc(doc(db, 'forms', id), {
        ...inputValues[id],
      });

      await fetchData();

      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        [id]: {},
      }));
    } catch (error) {
      console.error(`Error saving input to Firestore for ID ${id}:`, error);
    }
  };

  const displayFileLink = async (fileupload) => {
    try {
      const storageRef = ref(storage, fileupload);
      const downloadURL = await getDownloadURL(storageRef);
      window.open(downloadURL, '_blank');
    } catch (error) {
      console.error('Cannot display file', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (error) {
      setError('Failed to login. Please check your credentials.');
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getTicketColor = (submitDate, submitTime) => {
    try {
      const submitDateTimeString = `${submitDate}T${submitTime}`;
      const submitDateTime = new Date(submitDateTimeString);
  
      if (isNaN(submitDateTime.getTime())) {
        return '#90EE90'; // Light green
        console.error('Invalid date time string:', submitDateTimeString);

      }
      
  
      const currentDateTime = new Date();
      const hoursDifference = (currentDateTime - submitDateTime) / (1000 * 60 * 60);
      console.log('Hours Difference:', hoursDifference);
      if (hoursDifference <= 3) return '#90EE90'; // Light green
      if (hoursDifference <= 8) return '#ADFF2F'; // Green-yellow
      return '#FFB6C1'; // Light red
    } catch (error) {
      console.error('Error in getTicketColor:', error);
      return '#90EE90'; // Light green
    }
  };

  // Filter tickets based on selected section
  const filteredFormDataList = selectedTreater === 'כולם'
    ? formDataList.filter(item => !item.isClosed) // Only open tickets
    : selectedTreater === 'סגורות'
    ? formDataList.filter(item => item.isClosed) // Only closed tickets
    : formDataList.filter(item => item.treater === selectedTreater && !item.isClosed); // Filter by selected treater

  useEffect(() => {
    document.addEventListener('input', (event) => {
      if (event.target.tagName.toLowerCase() === 'textarea') {
        event.target.style.height = 'auto';
        event.target.style.height = (event.target.scrollHeight) + 'px';
      }
    });

    return () => {
      document.removeEventListener('input', (event) => {
        if (event.target.tagName.toLowerCase() === 'textarea') {
          event.target.style.height = 'auto';
          event.target.style.height = (event.target.scrollHeight) + 'px';
        }
      });
    };
  }, []);

  return (
    <div>
      <NavBar setSelectedTreater={setSelectedTreater} />
      {!loggedIn ? (
        <div className="login-form">
          <form onSubmit={handleLogin}>
            <h1>התחברות</h1>
            <div className="form-group">
              <label htmlFor="login_email">:אימייל</label><br />
              <input
                id="login_email"
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="login_password">:סיסמא</label><br />
              <input
                id="login_password"
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button id="login_button" type="submit">התחברות</button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      ) : (
        <div>
          <button onClick={handleLogout} id='logout'>התנתק</button>
          <h1>קריאות</h1>
          <table>
            <thead>
              <tr>
                <th>תאריך</th>
                <th>שעה</th>
                <th>שם מלא</th>
                <th>אימייל</th>
                <th>טלפון</th>
                <th>מחלקה</th>
                <th>תת-מחלקה</th>
                <th>סוג הבעיה</th>
                <th>עדיפות</th>
                <th>תיאור הבעיה</th>
                <th>הערות</th>
                <th>סטטוס</th>
                <th>זמן טיפול לחיוב</th>
                <th>תמונה\קובץ</th>
                <th>מטפל</th>
                <th>מחק\שמור הערות</th>
              </tr>
            </thead>
            <tbody>
              {filteredFormDataList.map((formDataItem, index) => (
                <tr key={index} style={{ backgroundColor: getTicketColor(formDataItem.submitDate, formDataItem.submitTime) }}>
                  <td>{formDataItem.submitDate}</td>
                  <td>{formDataItem.submitTime}</td>
                  <td>{formDataItem.name}</td>
                  <td>{formDataItem.email}</td>
                  <td>{formDataItem.phone}</td>
                  <td>{formDataItem.department}</td>
                  <td>{formDataItem.tat_department}</td>
                  <td>{formDataItem.type_of_problem}</td>
                  <td>{formDataItem.priority}</td>
                  <td>{formDataItem.description}</td>
                  <td>
                    <textarea
                      type="text"
                      value={inputValues[formDataItem.id]?.comments || formDataItem.comments || ''}
                      onChange={(e) => handleInputChange(formDataItem.id, 'comments', e.target.value)}
                      id="comments"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={inputValues[formDataItem.id]?.checkboxValue || formDataItem.checkboxValue || false}
                      onChange={(e) => handleInputChange(formDataItem.id, 'checkboxValue', e.target.checked)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={inputValues[formDataItem.id]?.numberValue || formDataItem.numberValue || ''}
                      onChange={(e) => handleInputChange(formDataItem.id, 'numberValue', e.target.value)}
                    />
                  </td>
                  <td><a href="#" onClick={() => displayFileLink(formDataItem.fileupload)}>View file</a></td>
                  <td>
                    <select
                      value={inputValues[formDataItem.id]?.treater || formDataItem.treater || ''}
                      onChange={(e) => handleInputChange(formDataItem.id, 'treater', e.target.value)}
                      id="treater"
                    >  
                      <option value="" className='problem_solver'></option>

                      <option value="טלי" className='problem_solver'>טלי</option>
                      <option value="עידו" className='problem_solver'>עידו</option>
                      <option value="גיא" className='problem_solver'>גיא</option>
                      <option value="מגי" className='problem_solver'>מגי</option>
                      <option value="אברהם" className='problem_solver'>אברהם</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => closeTicket(formDataItem.id)}>
                      סגור 
                    </button>
                    <button onClick={() => saveInputToFirestore(formDataItem.id)}>
                      שמור הערות
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DisplayComponent;

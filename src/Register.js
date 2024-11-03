import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Importing createUserWithEmailAndPassword

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create user with email and password
      await createUserWithEmailAndPassword(auth, email, password);
      // If successful, navigate to the desired page (e.g., home)
      navigate('/');
    } catch (error) {
      console.error('Error registering:', error);
      setError('Error registering. Please try again.');
    }
  };

  return (
    <div className="register-form">
      <div className="container">
        <h1>צור חשבון חדש</h1>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="register_email">:אימייל</label><br />
            <input id="register_email" className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="register_password">:סיסמא</label><br />
            <input id="register_password" className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" id='register_button'>הרשמה</button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <button onClick={() => navigate('/')}>חזור להתחברות</button>
      </div>
    </div>
  );
};

export default Register;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import DisplayComponent from './DisplayComponent';
import FormComponent from './FormComponent';
import Portal from './Portal';
import RegisterComponent from './Register';
import Register from './Register';


const App = () => {


  
  

  return (
    <Router>
 
      <Routes>
      <Route path="/" element={<FormComponent />} />
        <Route path="/display" element={<DisplayComponent />} />
       <Route path='/portal-hadracot' element={<Portal></Portal>}></Route>
       <Route path='/new_password' element={<Register></Register>}></Route>
        </Routes> 
        
    </Router>
  
  
    );
};

export default App;

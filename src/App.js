import logo from './logo.svg';
import './App.css';
import Home from './Components/Home';
import Signup from './Components/Signup';
import Login from './Components/Login';
import { Route, Router, Routes } from 'react-router-dom';
import WithAuthProtection from './Components/WithAuthProtection';
import DescriptionPage from './Components/DescriptionPage';

function App() {
  const Protected=WithAuthProtection(Home);
  return (
    <div className="App">
     <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/Signup' element={<Signup/>}></Route>
      <Route path='/Home' element={< Protected/>} />
      
     </Routes>
    </div>
  );
}

export default App;

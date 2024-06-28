import logo from './logo.svg';
import './App.css';
import Home from './Components/Home';
import Signup from './Components/Signup';
import Login from './Components/Login';
import { Route, Router, Routes } from 'react-router-dom';
import WithAuthProtection from './Components/WithAuthProtection';

function App() {
  const Protected=WithAuthProtection(Home);//One way to use HOC is to use it here or we can also enhance Home component in Home.js as well and export it in Home and use it here
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

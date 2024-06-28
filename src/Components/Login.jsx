import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
   const navigate=useNavigate();
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    function handlePassword(event){
        event.preventDefault();
        setPassword(event.target.value);
    }
    function handleEmail(event){
        event.preventDefault();
        setEmail(event.target.value);
    }
   async function handleSubmit(event){
       event.preventDefault();
       try{
        await signInWithEmailAndPassword(auth,email,password)
        console.log('logged in successfully')
        navigate('/Home')
       }
       catch(error){
        console.log(error.message);
       }
       
   }
    async function googleLogin(){
        const provider=new GoogleAuthProvider();
        signInWithPopup(auth,provider).then(async (result) => {
            console.log(result);
            if(result.user){
                console.log('user logged in using google')
                navigate('Home')
            }
        })
    }
  return (
    <div>
    <form>
      <label>Email:</label>
      <input type="text" onChange={handleEmail}></input>
      <label>Password:</label>
      <input type="password" onChange={handlePassword}></input>
      <button onClick={handleSubmit}>Submit</button>
      <div onClick={googleLogin}><p>Sign up with google</p></div>
    </form>
    </div>
  )
}

export default Login

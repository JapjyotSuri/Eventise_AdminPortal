import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup ,sendPasswordResetEmail} from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import googleLoginPic from '../googleLogin.png'

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
    async function handleReset(){
       const user=auth.currentUser;
       await sendPasswordResetEmail(auth,email).then(()=> (
        alert("Password Reset Link sent to email")
       )).catch((error) => (
        alert("error occured",error)
       ))

       

    }
  return (

    <div className='flex min-h-screen justify-center items-center '>
      <div className='w-[500px] h-[500px] m-4 p-4 flex items-center justify-center flex-col gap-5 rounded-2xl shadow-md bg-white text-black text-[19px]'>
      <label>Email:</label>
      <input type="text" onChange={handleEmail} className=' w-[400px] h-[50px] border-black bg-slate-100 rounded-l'></input>
      <label>Password:</label>
      <input type="password" onChange={handlePassword} className='w-[400px] h-[50px] border-black bg-slate-100 rounded-l'></input>
      <div><h3 className='' onClick={handleReset}>forgotten your password?</h3></div>
      <button onClick={handleSubmit} className='bg-blue-500 w-[220px] h-[50px] rounded-lg text-white'>Login</button>
      <div><h1>OR</h1></div>
      <img onClick={googleLogin} src={googleLoginPic} className='w-[45%]'/>
      
      </div> 
    </div>
  )
}

export default Login

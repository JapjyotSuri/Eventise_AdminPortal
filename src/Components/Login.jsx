import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup ,sendPasswordResetEmail} from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import googleLoginPic from '../googleLogin.png'
import { Formik } from 'formik';
import { firestore } from '../firebase';
import { addDoc, collection, getDocs, updateDoc, doc, onSnapshot, deleteDoc ,setDoc} from '@firebase/firestore'
const Login = () => {
   const navigate=useNavigate();
   async function LoginFunc(values) {
    console.log(values);

   try {
     await signInWithEmailAndPassword(auth,values.email, values.password).then(() => {
        alert("user signed in" + values.email)
        navigate('Home')
     }).catch((error)=>{
        alert("error occured"+ error);
     })
    
   }
   catch (error) {
     console.log(error)
     alert(error.nativeErrorMessage)
   }
 }
    async function googleLogin(){
        const provider=new GoogleAuthProvider();
        signInWithPopup(auth,provider).then(async (result) => {
            console.log(result);
            if(result.user){
            
            const userData = {
            uid: result.user.uid,
            name: result.user.displayName,
            email: result.user.email,
            role: 0,
            isEmailVerified: true,
    
          }
          const docToSet=doc(firestore,'users',result.user.uid)
        await setDoc(docToSet,userData);
                navigate('Home')
            }
        })
    }
    async function handleReset(values){
       const user=auth.currentUser;
       await sendPasswordResetEmail(auth,values.email).then(()=> (
        alert("Password Reset Link sent to email")
       )).catch((error) => (
        alert("error occured",error)
       ))

       

    }
  return (

    <div className=' min-h-screen flex justify-center items-center'>
       <Formik
            initialValues={{email: '', password: ''}}
            
            onSubmit={(values) => {
              console.log(values)
              LoginFunc(values);
            //   navigation.navigate('Login')
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,

            }) => (
              <div className='w-[500px] h-[500px] m-4 p-4 flex items-center justify-center flex-col gap-5 rounded-2xl shadow-md bg-white text-black text-[19px]'>
                
                <div>
                  <input  placeholder='Email' value={values.email} onChange={handleChange('email')} className=' w-[400px] h-[50px] border-black bg-slate-100 rounded-l pl-4'/>
                </div>
                

                <div>
                  <input  placeholder='Password' value={values.password} onChange={handleChange('password')} secureTextEntry={true} className=' w-[400px] h-[50px] border-black bg-slate-100 rounded-l pl-4'/>
                </div>
                <div><h3 className='' onClick={() => handleReset(values)}>forgotten your password?</h3></div>
                <button onClick={handleSubmit} className='bg-blue-500 w-[220px] h-[50px] rounded-lg text-white'><h1>Login</h1></button>
                <div className='flex flex-row w-[100%] justify-center items-center gap-2'>
                  <h1>Dont have an account? </h1>
                  <button onClick={() => navigate('Signup')} className=' text-blue-500'>Signup</button>
                </div>

                <div><h1>OR</h1></div>
                <img onClick={googleLogin} src={googleLoginPic} className='w-[45%]'/>

              </div>
            )}
          </Formik>
    </div>
  )
}

export default Login

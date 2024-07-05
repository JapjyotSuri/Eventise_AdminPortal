import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup ,sendPasswordResetEmail} from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import googleLoginPic from '../googleLogin.png'
import { Formik } from 'formik';
import { firestore } from '../firebase';
import {  doc, setDoc} from '@firebase/firestore'
import * as Yup from 'yup'
const Login = () => {
   const navigate=useNavigate();
   const LoginValidationSchema = Yup.object().shape({
    email: Yup.string().email('Please enter valid email').required('Email address is required'),

    password: Yup.string()
      .required('password is required')
  })

   async function LoginFunc(values) {
    console.log(values);

   try {
     await signInWithEmailAndPassword(auth,values.email, values.password).then(() => {
        
        navigate('Home')
        
     }).catch((error)=>{
        alert("error occured"+ error);
     })
    
   }
   catch (error) {
     console.log(error)
     alert(error)
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
            role: 1,
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

    <div className=' min-h-screen flex justify-center items-center '>
       <Formik
            initialValues={{email: '', password: ''}}
            validationSchema={LoginValidationSchema}
            onSubmit={(values) => {
              console.log(values)
              LoginFunc(values);
              
            }}
          >
            {({
              values,
              errors,
              touched,              
              handleChange,
              handleSubmit,

            }) => (
              <div className='w-[450px] h-[500px]  p-4 flex items-center justify-center flex-col gap-3 rounded-2xl shadow-md bg-white  text-black text-[19px] '>
                <div className='flex justify-start w-[85%]'>
                <label className='text-[17px]'>Enter Email: </label>
                </div>
                <div>
                
                  <input  placeholder='Email' value={values.email} onChange={handleChange('email')} className=' w-[350px] h-[50px] border-black bg-slate-100 rounded-l pl-4'/>
                </div>
                {(errors.email && touched.email) && <h1 className=' text-red-500 text-[17px] my-[-10px]'>{errors.email}</h1>}
                <div className='flex justify-start w-[85%]'>
                <label className='text-[17px]'>Enter Password: </label>
                </div>
                <div>
                  <input  placeholder='Password' value={values.password} onChange={handleChange('password')} type='password' className=' w-[350px] h-[50px] border-black bg-slate-100 rounded-l pl-4'/>
                </div>
                {(errors.password && touched.password) && <h1 className=' text-red-500 text-[17px] my-[-10px]'>{errors.password}</h1>}
                <div className='w-[85%]  flex justify-start'><h3  onClick={() => handleReset(values)} className='text-[17px] text-blue-400'>forgotten your password?</h3></div>
                <button onClick={handleSubmit} className='bg-blue-500 w-[350px] h-[50px] rounded-lg text-white'><h1>Login</h1></button>
                <div className='flex flex-row w-[85%] justify-start items-center gap-2 '>
                  <h1 className='text-[17px]'>Dont have an account? </h1>
                  <button onClick={() => navigate('Signup')} className=' text-blue-500 text-[17px]'>Signup</button>
                </div>

                <div className=''><h1 className='text-[18px]'>OR</h1></div>
                <img onClick={googleLogin} src={googleLoginPic} className='w-[220px]'/>

              </div>
            )}
          </Formik>
    </div>
  )
}

export default Login

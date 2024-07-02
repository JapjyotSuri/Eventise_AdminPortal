import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import {addDoc,collection,getDoc,doc,onSnapshot,deleteDoc,setDoc} from '@firebase/firestore'
import { auth, firestore } from '../firebase';
import * as Yup from 'yup'
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
    const navigate=useNavigate();
    const SignupValidationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Please enter valid email').required('Email address is required'),
    
        password: Yup.string()
          .min(8, 'Should be min of 8 characters')
          .required('password is required').matches(
            /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/,
            "Must Contain 8 Characters, One Lowercase and One Number"
          ),
    
        confirmpassword: Yup.string()
          .min(8, 'Should be min of 8 characters')
          .required('Confirm Password is required').matches(
            /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/,
            "Must Contain 8 Characters, One Lowercase and One Number "
          )
      })
    async function signUpFunc(values) {
         console.log(values);

        try {
          await createUserWithEmailAndPassword(auth,values.email, values.password)
          
          const user = auth.currentUser;
          const userData = {
            uid: user.uid,
            name: values.name,
            email: values.email,
            role: 0,
            isEmailVerified: true,
    
          }
          const docToSet=doc(firestore,'users',user.uid)//here we are using doc not get doc as we only need the reference of the document not the whole document
          await setDoc(docToSet,userData)
          alert("User created " + values.email)
          navigate('Home')
        //   navigation.navigate('Login')
        }
        catch (error) {
          console.log(error)
          alert(error.nativeErrorMessage)
        }
      }

  return (
    <div className=' min-h-screen flex justify-center items-center'>
       <Formik
            initialValues={{ name: '', email: '', password: '', confirmpassword: '' }}
            validationSchema={SignupValidationSchema}
            onSubmit={(values) => {
              console.log(values)
              signUpFunc(values);
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
                  <input  placeholder='name' value={values.name} onChange={handleChange('name')} className=' w-[400px] h-[50px] border-black bg-slate-100 rounded-l pl-4'/>
                </div>
                {(errors.name && touched.name) && <h1>{errors.name}</h1>}
                <div>
                  <input  placeholder='Email' value={values.email} onChange={handleChange('email')} className=' w-[400px] h-[50px] border-black bg-slate-100 rounded-l pl-4'/>
                </div>
                {(errors.email && touched.email) && <h1>{errors.email}</h1>}

                <div>
                  <input  placeholder='Password' value={values.password} onChange={handleChange('password')} secureTextEntry={true} className=' w-[400px] h-[50px] border-black bg-slate-100 rounded-l pl-4'/>
                </div>
                {(errors.password && touched.password) && <h1>{errors.password}</h1>}
                <div>
                  <input  placeholder='Confirm Password' value={values.confirmpassword} onChange={handleChange('confirmpassword')} secureTextEntry={true} className=' w-[400px] h-[50px] border-black bg-slate-100 rounded-l pl-4'/>
                </div>
                {(errors.confirmpassword && touched.confirmpassword) && <h1>{errors.confirmpassword}</h1>}
                <button onClick={handleSubmit} className='bg-blue-500 w-[220px] h-[50px] rounded-lg text-white'><h1>Sign up</h1></button>
                <div className='flex-row w-[400px] flex justify-center items-center gap-2'>
                  <p>Already have an account? </p>
                  <button onClick={() => navigate('/')} className=' text-blue-500'>Login</button>
                </div>
              </div>
            )}
          </Formik>
    </div>
  )
}

export default Signup

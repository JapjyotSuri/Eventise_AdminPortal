import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../firebase';

const Signup = () => {
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
    function handleConfirmPassword(event){
        event.preventDefault();
        setConfirmPassword(event.target.value);
    }
    async function handleSubmit(event){
        event.preventDefault();
        try{
            await createUserWithEmailAndPassword(auth,email,password);
            const user=auth.currentUser;
            console.log(user);
            console.log('user logged in successfuly')
        }
        catch(error){
            console.log(error.message);
        }
       

    } 
  return (
    <div>
        <form >
      <label>Email:</label>
      <input type="text" onChange={handleEmail}></input>
      <label>Password:</label>
      <input type="password" onChange={handlePassword}></input>
      <label>Confirm Password:</label>
      <input type="password" onChange={handleConfirmPassword}></input>
      <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  )
}

export default Signup

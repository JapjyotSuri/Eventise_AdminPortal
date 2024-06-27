import React, { useState } from 'react'
import { firestore } from '../firebase';
import {addDoc,collection} from '@firebase/firestore'
const Home = () => {
    const [name,setName]=useState('');
    function handleText(event){
        event.preventDefault();
        console.log(event.target.value)
        setName(event.target.value);
        
    }
    function handleSubmit(event){
        event.preventDefault();
        console.log('hi')
        console.log(name)
     const ref=collection(firestore,"messages")
     let data={
        messages: name
     }
     try{
         addDoc(ref,data)
     }
     catch(error){
        console.log(error)
     }

    }
  return (
    <div>
      <h1>Home</h1>
      <form onSubmit={handleSubmit}>
        <label>Enter message</label>
        <input type='text' id='message' onChange={handleText}/>
        <button style={{height: 20,width: 100}} type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Home

import React, { useEffect } from 'react'
import { firestore ,auth} from '../firebase'
import {getDocs,collection,query,where} from '@firebase/firestore'
const FilterData = () => {
    useEffect(()=>{
       async function fetchAdmin(){
        console.log("filtering")
        const userCollect=collection(firestore,'users');
        const userQuery= query(userCollect,where('role','==','0'))
        const querySnapshot= await getDocs(userQuery);
        querySnapshot.forEach(doc => {
         console.log(doc.id,"=>",doc.data());
        });
       }
       fetchAdmin();

    },[])
  return (

    <div>
        <h1>filterData</h1>
    </div>
  )
}

export default FilterData

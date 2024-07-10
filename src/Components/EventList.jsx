import React, { useEffect, useState } from 'react'
import { firestore } from '../firebase';
import {  collection, getDoc, doc, onSnapshot, query, orderBy } from '@firebase/firestore'
import EventsTable from './EventsTable';
import EventCard from './EventCard';
import DescriptionPage from './DescriptionPage';
const EventList = ({eventFilter}) => {
  const [filteredList,setFilteredList]=useState([]);
    const [showDescription,setShowDescription]=useState(false);
    const [currentEvent,setCurrentEvent]=useState(null);
    const [eventList,SetEventList]=useState(null);
    function showDescriptionHandler(option,event){
          
            setShowDescription(option);
          
          setCurrentEvent(event);
    }
    useEffect(()=>{
        const eventCollection=collection(firestore,'events');
        // const eventQuery=collection(eventCollection,));

        const unsubscribe=onSnapshot(eventCollection,(snapshot)=> {
            const eventsList=snapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data()
            }))
            console.log(eventsList);
            SetEventList(eventsList);
            
            const filteredEvents=eventsList.filter((event)=> {
              if(eventFilter === 'pending'){
               return event.status==='pending'
              }
              else if(eventFilter === 'rejected'){
               return event.status==='Rejected'
              }
              else if(eventFilter === 'approved'){
               return event.status==='Approved'
              }
              else{
                return true;
              }
           })
           setFilteredList(filteredEvents)
        })
        
        return ()=> unsubscribe();
    },[firestore,eventFilter])

  return (
    <div>
      <h1>{eventFilter} Events List</h1>
      <div>
      
      </div>
      <div className='flex flex-wrap justify-center items-center'>{
       filteredList && filteredList.map((event)=>(
        <EventCard event={event} showDescriptionHandler={showDescriptionHandler}/>  
       ))
       
    }
    {/* {
       eventList && eventFilter === 'pending' && eventList.filter((event) => ( event.status==='pending')).map((event) => (
        <EventCard event={event} showDescriptionHandler={showDescriptionHandler}/> 
       ))
       
    } */}
    </div>
    <div className='overlay'>
       {showDescription && currentEvent && <DescriptionPage currentEvent={currentEvent} showDescriptionHandler={showDescriptionHandler}/>} 
    </div>
    </div>
  )
}

export default EventList


import React, { useState } from 'react'
import { firestore } from '../firebase';
import { updateDoc, doc, deleteDoc } from '@firebase/firestore'
import { deleteUser } from 'firebase/auth';
import { MdDelete } from "react-icons/md";
import { useNavigate} from 'react-router-dom';
const EventsTable = ({eventList}) => {
    const navigate=useNavigate();
    // async function handleChange(user, newRole) {//this handles the updates in the role that admin makes
    //     const userDoc = doc(firestore, 'users', user.uid);
    //     try {
    //         if (newRole === 'admin') {
    //             await updateDoc(userDoc, {
    //                 role: 0,
    //             })
    //         }
    //         else {
    //             await updateDoc(userDoc, {
    //                 role: 1,
    //             })
    //         }
    //     }
    //     catch (error) {
    //         console.log("error occured", error)
    //     }
    // }
    // async function handleDelete(user) {

    //     const userToDelete = doc(firestore, 'users', user.uid);

    //     try {

    //         await deleteDoc(userToDelete);
    //     }
    //     catch (error) {
    //         console.log("error occured", error)
    //     }
    // }
    
  return (
    <div>
       
   
        <div className=' w-full flex flex-col  justify-center items-center ml-[-50px]'>
            <table className='min-w-[90%] border-collapse border border-gray-300'>
                <thead>
                    <tr>
                        <th className="border border-gray-400 px-4 py-2">Title</th>
                        <th className="border border-gray-400 px-4 py-2">Description</th>
                        <th className="border border-gray-400 px-4 py-2">date</th>
                        <th className="border border-gray-400 px-4 py-2">Location</th>
                        <th className="border border-gray-400 px-4 py-2">Creator</th>
                        <th className="border border-gray-400 px-4 py-2">Status</th>
                        <th className="border border-gray-400 px-4 py-2">Delete</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        eventList.map((event, index) => (
                            
                            <tr key={index} onClick={() => navigate('Description',{event: event})}>
                                <td className="border border-gray-400 px-4 py-2"> {event.title} </td>
                                <td className="border border-gray-400 px-4 py-2">{event.description}</td>
                                <td className="border border-gray-400 px-4 py-2">
                                {event.date.toDate().toLocaleDateString()}
                                    </td>
                                    <td className="border border-gray-400 px-4 py-2">{event.location}</td>
                                <td className="border border-gray-400 px-4 py-2">{event.username}</td>
                                <td className='border border-gray-400 px-4 py-2 '>
                                    {/* <select
                                        value={user.role === 0 ? 'admin' : 'user'}
                                        onChange={(e) => handleChange(user, e.target.value)}
                                        className='bg-transparent  px-3 py-1 rounded-md outline-none border focus:ring-2 focus:ring-white'>
                                        <option value='user'>User</option>
                                        <option value='admin'>Admin</option>
                                    </select> */}

                                </td>
                                
                                <td className="border border-gray-400 px-4 py-2">

                                    <button ><MdDelete className='h-[22px] w-[22px] text-red-500' /></button>
                                </td>
                            </tr>
                           
                        ))
                    }
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default EventsTable

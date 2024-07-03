import React, { useState } from 'react'
import { firestore } from '../firebase';
import { addDoc, collection, getDoc, updateDoc, doc, onSnapshot, deleteDoc } from '@firebase/firestore'
import { auth } from '../firebase';
import { deleteUser} from 'firebase/auth';
import { MdDelete } from "react-icons/md";
const Table = ({currentUsers}) => {
    
    async function handleChange(user,newRole) {
        const userDoc = doc(firestore, 'users', user.uid);
        try {
            if (newRole === 'admin') {
                await updateDoc(userDoc, {
                    role: 0,
                })
            }
            else {
                await updateDoc(userDoc, {
                    role: 1,
                })
            }
        }
        catch (error) {
            console.log("error occured", error)
        }
    }
    async function handleDelete(user) {

        const userToDelete = doc(firestore, 'users', user.uid);

        try {
            await deleteUser(user).then(() => {
                alert('User deleted')
            })
            await deleteDoc(userToDelete);
        }
        catch (error) {
            console.log("error occured", error)
        }
    }
  return (
    <div className=' w-full flex flex-col  justify-center items-center ml-[-50px]'>
      <table className='min-w-[90%] border-collapse border border-gray-300'>
                                        <thead>
                                            <tr>
                                                <th className="border border-gray-400 px-4 py-2">name</th>
                                                <th className="border border-gray-400 px-4 py-2">email</th>
                                                <th className="border border-gray-400 px-4 py-2">Role</th>
                                                <th className="border border-gray-400 px-4 py-2">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                currentUsers.map((user, index) => (
                                                    <tr key={index}>
                                                        <td className="border border-gray-400 px-4 py-2"> {user.name} </td>
                                                        <td className="border border-gray-400 px-4 py-2">{user.email}</td>
                                                        <td className='border border-gray-400 px-4 py-2 '>
                                                            <select 
                                                            value={user.role === 0 ? 'admin' : 'user'}
                                                            onChange={(e) => handleChange(user,e.target.value)}
                                                            className='bg-transparent  px-3 py-1 rounded-md outline-none border focus:ring-2 focus:ring-white'>
                                                                <option value='user'>User</option>
                                                                <option value='admin'>Admin</option>
                                                            </select>
                                                                
                                                        </td>
                                                        <td className="border border-gray-400 px-4 py-2">
                                                            
                                                            <button onClick={() => handleDelete(user)}><MdDelete className='h-[22px] w-[22px] text-red-500'/></button>
                                                        </td>
                                                    </tr>

                                                ))
                                            }
                                        </tbody>
                                    </table>
    </div>
  )
}

export default Table

import React, { useEffect, useState } from 'react'
import { firestore } from '../firebase';
import { addDoc, collection, getDocs, updateDoc, doc, onSnapshot, deleteDoc } from '@firebase/firestore'
import { auth } from '../firebase';
import { deleteUser, signOut } from 'firebase/auth';
const Home = () => {

    const [userList, setUserList] = useState([]);
    useEffect(() => {//using onSnapshot here to get real time updates whenever some data in the firestore gets changed
        const userCollection = collection(firestore, 'users');
        const unsubscribe = onSnapshot(userCollection, (snapshot) => {
            const usersList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUserList(usersList);
        });

        // Cleanup the listener on component unmount
        return () => unsubscribe();
    }, [])
    async function handleClick(user) {
        const userDoc = doc(firestore, 'users', user.uid);
        try {
            if (user.role === 0) {
                await updateDoc(userDoc, {
                    role: 1,
                })
            }
            else {
                await updateDoc(userDoc, {
                    role: 0,
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
        <div className=' w-full flex flex-row   min-h-screen'>
            <div className='w-[30%] min-h-screen bg-slate-500'>
                <h1>Admin Portal</h1>
            </div>
            <div className='flex flex-col mt-3'>
                <div className='w-full  justify-start items-center'>
                    <input type='text' className='h-[40px] w-[100px] border-black' placeholder='Search' />
                </div>
                <div>
                    <div>
                        <h1>Welcome back!!!!</h1>
                    </div>
                    <div className='flex flex-row m-10 justify-center gap-10 '>
                        <div className=' bg-slate-600 rounded-lg w-[100px] h-[40px] flex justify-center items-center'><h1>Admin</h1></div>
                        <div className=' bg-slate-600 rounded-lg w-[100px] h-[40px] flex justify-center items-center'><h1>User</h1></div>
                    </div>
                    <div className=' w-full flex flex-wrap  justify-center items-center'>
                        {
                            userList.map((user) => (
                                <div className='w-[300px] h-[300px] m-4 p-4 flex items-center justify-center flex-col gap-5 rounded-2xl shadow-md bg-white text-black text-[19px]'>
                                    <div className=' w-full flex flex-col justify-center items-center'>
                                        <div className=''>
                                            <div>

                                            </div>
                                            <h1>{user.name}</h1>
                                            <h1>{user.email}</h1>
                                            <div className='flex flex-row justify-between'>
                                                <div onClick={() => handleClick(user)}>{
                                                    user.role === 0 ? <button className=' bg-green-400 text-white'>Admin</button> : <button className='bg-red-500 text-white' >User</button>
                                                }</div>
                                                <button >Edit</button>
                                                <button onClick={() => handleDelete(user)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home

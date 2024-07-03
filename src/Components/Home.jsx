import React, { useEffect, useState } from 'react'
import { firestore } from '../firebase';
import { addDoc, collection, getDoc, updateDoc, doc, onSnapshot, deleteDoc } from '@firebase/firestore'
import { auth } from '../firebase';
import { deleteUser, signOut } from 'firebase/auth';
import { FaRegUserCircle } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Table from './Table';

const Home = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [userList, setUserList] = useState([]);
    const [search, setSearch] = useState('')
    const [filtered, setFiltered] = useState([]);
    const [page, setPage] = useState(1);
    const [name, setName] = useState('');
    const itemsPerPage = 6;
    const [adminCount, setAdminCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const LastIndex = itemsPerPage * page;
    const firstIndex = LastIndex - itemsPerPage;
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const currentUsers = filtered.slice(firstIndex, LastIndex);
     
    function handlePrev() {
        setPage(Math.max(1, page - 1));
    }
    function handleNext() {
        setPage(Math.min(totalPages, page + 1));
    }
    function handleSearchChange(e) {
        setSearch(e.target.value);

    }
    function handleSearch() {
        if (search === '') {
            setFiltered(userList)

        }
        else {
            const newUsers = userList.filter((user) => {

                return (
                    search &&
                    (user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search))
                );
            })
            setFiltered(newUsers);
            setSearch('');
        }

    }
    useEffect(() => {//using onSnapshot here to get real time updates whenever some data in the firestore gets changed
        try {
            setIsLoading(true);
            console.log('hello')
            const userCollection = collection(firestore, 'users');
            console.log('hi')
            const user = auth.currentUser

            const unsubscribe = onSnapshot(userCollection, (snapshot) => {
                console.log('hi I have reached here')
                const usersList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                let adminNumber = 0;
                usersList.map((user) => {
                    if (user.role === 0) {
                        adminNumber = adminNumber + 1;
                    }
                })
                async function getName() {
                    const docRef = doc(firestore, 'users', user.uid);
                    const data = await getDoc(docRef);
                    if (data.exists()) {
                        console.log(data.data());
                        setName(data.data().name)
                    }
                    console.log('waiting');
                }
                getName()
                setAdminCount(adminNumber);
                setUserCount(usersList.length - adminNumber);
                setUserList(usersList);
                setFiltered(usersList);
                console.log(user)
                setIsLoading(false);
            }, (error) => {//here we had to write it like and and using try cath block doesnt catch the error as onSnapshot is an async function so try catch initially doesnt catch the error causing it not give alert
                if (error.code === 'permission-denied') {
                    alert('permission denied')
                    navigate('/')


                } else {
                    console.log('An unexpected error occurred:', error);
                }
            });

            // Cleanup the listener on component unmount
            return () => unsubscribe();
        }
        catch (error) {
            if (error.code === 'permission-denied') {
                alert('You do not have permission to access this data');
            } else {
                console.log('An unexpected error occurred:', error);
            }
        }

    }, [])
    
    async function handleLogout(){
        await signOut(auth);
        navigate('/');
    }
    return (

        <div className=' w-[100%] flex flex-row   min-h-screen  '>
            {
                isLoading ? (<div><h1>Loading.....</h1></div>) : (
                    <div className=' w-[100%] flex flex-row   min-h-screen  overflow-x-hidden'>
                        <div className='w-[17%] min-h-screen bg-[#222322] flex flex-col justify-between'>
                            <div className='flex flex-col '>
                            <div className='m-5 flex flex-row justify-start items-center gap-2'>
                                <FaRegUserCircle className='h-[45px] w-[45px] text-white' />
                                <h1 className=' text-[35px] text-white'>{name}</h1>
                            </div>
                           
                            <div className='flex justify-start ml-5'>
                            <h1 className='text-[25px]  text-white'>Admin Portal</h1>
                            </div>
                            </div>
                            <div onClick={handleLogout} className='mb-5 '>
                                <h1 className='text-red-500 text-[30px]'>Logout</h1>
                            </div>
                        </div>
                        <div className='flex flex-col mt-3  w-[75%] '>

                            <div className='flex flex-col justify-center items-start w-full ml-11'>
                                <div>
                                    <h1 className='text-[30px]'>Welcome back, {name} !!!!</h1>
                                </div>
                                <div className='flex flex-row mt-5 justify-center gap-10 '>
                                    <div className=' bg-[#f1e2ff] rounded-lg w-[150px] h-[50px] flex justify-center items-center'><h1>Admin: {adminCount}</h1></div>
                                    <div className=' bg-[#dcffdf] rounded-lg w-[150px] h-[50px] flex justify-center items-center'><h1>User: {userCount}</h1></div>
                                </div>
                                <div className='w-full flex justify-start items-center '>
                                <button onClick={handleSearch}><FaSearch className='h-[25px] w-[25px]'/> </button>
                                    <input type='text' onChange={(e) => handleSearchChange(e)} value={search} className='h-[40px] w-[85%] m-5 border-black' placeholder='Search' />
                                    
                                </div>
                                
                                    <Table currentUsers={currentUsers}/>
                                    
                               
                                <div className='flex flex-row w-[90%] ml-2 justify-center gap-11 mt-6 '>
                                    <button onClick={handlePrev} className='bg-[#f1e2ff] rounded-lg h-[40px] w-[150px]'>Previous</button>
                                    <button onClick={handleNext} className='bg-[#dcffdf] rounded-lg h-[40px] w-[150px]'>Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }



        </div>
    )
}

export default Home

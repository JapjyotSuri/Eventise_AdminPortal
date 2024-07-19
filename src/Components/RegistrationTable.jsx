import React, { useState } from 'react'
import { SiTicktick } from "react-icons/si";
import { ImCross } from "react-icons/im";
import { firestore } from '../firebase';
import {setDoc,collection,doc,updateDoc} from '@firebase/firestore'
const RegistrationTable = ({registeredList}) => {
    const [registrationStatus,setRegistrationStatus]=useState('pending');
    async function handleApprove(registration){
         const registerationCollection=collection(firestore,'registrations')
         const registerationref=doc(registerationCollection,registration.id);
         await updateDoc(registerationref,({
            status: 'Approved'
         }))
         setRegistrationStatus('Approved')
    }
    async function handleReject(registration){
        const registerationCollection=collection(firestore,'registrations')
        const registerationref=doc(registerationCollection,registration.id);
        await updateDoc(registerationref,({
           status: 'Rejected'
        }))
        setRegistrationStatus('Rejected')
   }
  return (
    <div className=" w-full flex flex-col  justify-center items-center  ">
      <table className="min-w-[100%] ">
        <thead className='bg-gray-50 border-b-2  border-gray-300'>
            <tr>
                <th className="p-3 text-[17px] font-semibold tracking-wide text-left">Name</th>
                <th className="p-3 text-[17px] font-semibold tracking-wide text-left">Email</th>
                <th className="p-3 text-[17px] font-semibold tracking-wide text-left">Phone Number</th>
                <th className="p-3 text-[17px] font-semibold tracking-wide text-left">Status</th>
            </tr>
        </thead>
        <tbody class=' divide-y divide-gray-100'>
            {
                registeredList.map((registration,index)=>(
                    <tr className={index % 2 === 0 ? 'bg-white hover:bg-slate-100' : 'bg-gray-100 hover:bg-slate-50'} key={index}>
                        <td className="p-3 text-[16px] text-gray-700 text-left">{registration.name}</td>
                        <td className="p-3 text-[16px] text-gray-700 text-left">{registration.email}</td>
                        <td className="p-3 text-[16px] text-gray-700 text-left">{registration.phoneNummber}</td>
                        <td className="p-3 text-[16px] text-gray-700 text-left">
                            {registration.status=== 'pending' && 
                            <div className='flex flex-row justify-center items-center gap-4'>
                                <SiTicktick size={20} color='green' onClick={() => handleApprove(registration)}/>
                                <ImCross size={18} color='red' onClick={()=> handleReject(registration)}/>
                            </div>
                            }
                            {registration.status=== 'Approved' && 
                            <div className='flex flex-row justify-center items-center gap-2'>
                                
                                <h1 className='text-green-800 bg-green-200 text-[13px] p-1.5 rounded-lg uppercase font-medium'>Approved</h1>
                            </div>
                            }
                            {registration.status=== 'Rejected' && 
                            <div className='flex flex-row justify-center items-center gap-2'>
                                 
                                <h1 className='text-red-700 bg-red-200 text-[13px] p-1.5 rounded-lg uppercase font-medium'>Rejected</h1>
                            </div>
                            }
                        </td>
                    </tr>
                ))
            }
            
        </tbody>
      </table>
    </div>
  )
}

export default RegistrationTable

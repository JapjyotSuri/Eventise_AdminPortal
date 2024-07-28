import React from "react";
import { firestore } from "../firebase";
import { updateDoc, doc, deleteDoc } from "@firebase/firestore";

import { MdDelete } from "react-icons/md";
const Table = ({ currentUsers }) => {
  async function handleChange(user, newRole) {
    //this handles the updates in the role that admin makes
    const userDoc = doc(firestore, "users", user.uid);
    try {
      if (newRole === "admin") {
        await updateDoc(userDoc, {
          role: 0,
        });
      } else {
        await updateDoc(userDoc, {
          role: 1,
        });
      }
    } catch (error) {
      console.log("error occured", error);
    }
  }
  async function handleDelete(user) {
    const userToDelete = doc(firestore, "users", user.uid);

    try {
      await deleteDoc(userToDelete);
    } catch (error) {
      console.log("error occured", error);
    }
  }
  return (
    <div className=" w-full flex flex-col  justify-center items-center ml-[-50px]">
      <table className="min-w-[90%] rounded-xl overflow-hidden shadow-2xl">
        <thead className='bg-gray-100 border-b-2  border-gray-300'>
          <tr>
            <th className="p-3 text-[17px] font-semibold tracking-wide text-left">Name</th>
            <th className="p-3 text-[17px] font-semibold tracking-wide text-left">Email</th>
            <th className="p-3 text-[17px] font-semibold tracking-wide">Role</th>
            <th className="p-3 text-[17px] font-semibold tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {currentUsers.map((user, index) => (
            <tr className={index % 2 === 0 ? 'bg-white ' : 'bg-gray-100'} key={index}>
              <td className="p-3 text-[16px] text-gray-700 text-left"> 
                {user.name}
              </td>
              <td className="p-3 text-[16px] text-gray-700 text-left">{user.email}</td>
              <td className="p-3 text-[16px] text-gray-700  ">
                <select
                  value={user.role === 0 ? "admin" : "user"}
                  onChange={(e) => handleChange(user, e.target.value)}
                  className="bg-transparent  px-3 py-1 rounded-md outline-none border focus:ring-2 focus:ring-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-3 text-[16px] text-gray-700 ">
                <button>
                  <MdDelete
                    onClick={() => handleDelete(user)}
                    className="h-[22px] w-[22px] text-red-500"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

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
      <table className="min-w-[90%] border-collapse border border-gray-300 rounded-lg">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2">Name</th>
            <th className="border border-gray-400 px-4 py-2">Email</th>
            <th className="border border-gray-400 px-4 py-2">Role</th>
            <th className="border border-gray-400 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={index}>
              <td className="border border-gray-400 px-4 py-2">
                {" "}
                {user.name}{" "}
              </td>
              <td className="border border-gray-400 px-4 py-2">{user.email}</td>
              <td className="border border-gray-400 px-4 py-2 ">
                <select
                  value={user.role === 0 ? "admin" : "user"}
                  onChange={(e) => handleChange(user, e.target.value)}
                  className="bg-transparent  px-3 py-1 rounded-md outline-none border focus:ring-2 focus:ring-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="border border-gray-400 px-4 py-2">
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

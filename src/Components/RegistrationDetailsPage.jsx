import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { onSnapshot, collection, query, where } from "@firebase/firestore";
import RegistrationTable from "./RegistrationTable";
import { GiSplitCross } from "react-icons/gi";
const RegistrationDetailsPage = ({ showDescriptionHandler, currentEvent }) => {
  const [registeredList, setRegisteredList] = useState([]);
  useEffect(() => {
    console.log("current event in registrations", currentEvent);
    const registrationCollection = collection(firestore, "registrations");
    const registrationQuery = query(
      registrationCollection,
      where("eventId", "==", currentEvent.id)
    );
    const unsubscribe = onSnapshot(
      registrationQuery,
      (registrationSnapshot) => {
        const registered = registrationSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRegisteredList(registered);
      }
    );
    return () => unsubscribe();
  }, []);
  function closeHandler() {
    showDescriptionHandler(false, currentEvent);
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center flex-col">
       <div className="w-[750px]  flex justify-start items-start ">
        <button onClick={closeHandler} className=" text-red-500 ">
          <h1 className="text-[30px] ">
            <GiSplitCross size={40} />
          </h1>
        </button>
      </div>
      <div className="flex gap-4 items-center  flex-col items-center bg-white w-[650px] rounded-lg px-1.5 h-auto  ">
        {/* <h1 className="font-bold text-[20px] mt-[10px]">Registrations</h1> */}
        <div className="mb-1 w-full">
            <RegistrationTable registeredList={registeredList}/>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetailsPage;

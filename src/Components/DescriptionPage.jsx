import React, { useState } from "react";
import { firestore } from "../firebase";
import { doc, collection, updateDoc } from "@firebase/firestore";
import { CiLocationOn } from "react-icons/ci";
import { GiSplitCross } from "react-icons/gi";
import { GoDotFill } from "react-icons/go";
const DescriptionPage = ({ currentEvent, showDescriptionHandler }) => {
  const [eventStatus, setEventStatus] = useState(currentEvent.status);
  function closeHandler() {
    showDescriptionHandler(false, currentEvent);
  }
  async function handleAccept() {
    const eventRef = collection(firestore, "events");
    const eventDocref = doc(eventRef, currentEvent.id);
    await updateDoc(eventDocref, {
      status: "Approved",
    });
    setEventStatus("Approved");
  }
  async function handleReject() {
    const eventRef = collection(firestore, "events");
    const eventDocref = doc(eventRef, currentEvent.id);
    await updateDoc(eventDocref, {
      status: "Rejected",
    });
    setEventStatus("Rejected");
  }
  function textColor(eventStatus) {
    switch (eventStatus) {
      case "pending":
        return "text-yellow-400";
      case "Approved":
        return "text-green-400";
      default:
        return "text-red-400";
    }
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
      <div className="flex gap-10 items-center  flex-col bg-white w-[620px] h-auto  rounded-lg px-2 ">
        <div className="w-[100%] flex flex-col">
          <div className="flex w-[100%] justify-between px-4  items-center">
            <div className=" px-2 py-1 rounded-lg m-4 flex flex-row animate-pulse">
              <GoDotFill size={30} className={`${textColor(eventStatus)}`} />
              <h1
                className={` ${textColor(eventStatus)} font-bold text-[20px]`}
              >
                {eventStatus}
              </h1>
            </div>

            <h1 className="text-[20px]  font-bold m-4 text-gray-400">
              {currentEvent.title}
            </h1>
          </div>
          <div className="w-[100%] flex flex-row justify-center items-start gap-4">
            <img
              src={currentEvent.imgUrl}
              alt="Event image"
              className=" shadow-md rounded-2xl w-[95%] h-[300px] p-2 object-cover"
            />
          </div>
          <div className="w-[100%] flex flex-row justify-between items-center mt-4 px-6">
            <h1 className=" text-[18px] text-gray-400">
              {currentEvent.date.toDate().toLocaleDateString()}
            </h1>
            <h1 className="text-[18px] text-gray-400">
              Created by: {currentEvent.username}
            </h1>
            <div className="flex gap-1 items-center ">
              <CiLocationOn size={18} color="red" />
              <h1 className="text-[18px] text-gray-400">
                {currentEvent.location}
              </h1>
            </div>
          </div>

          <div className="w-[100%] flex justify-between items-start bg-white"></div>
          <div className="w-[100%] flex justify-between items-start bg-white my-5">
            <h1 className=" text-[20px] text-gray-400 px-6 text-justify">
              {currentEvent.description}
            </h1>
          </div>

          <div className="w-[100%] flex gap-5 items-end justify-center bg-white mb-3">
            <button
              onClick={() => handleReject()}
              className="bg-red-400 px-4 py-1 rounded-lg text-white"
            >
              Reject
            </button>
            <button
              onClick={() => handleAccept()}
              className="bg-green-400 px-4 py-1 rounded-lg text-white"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionPage;

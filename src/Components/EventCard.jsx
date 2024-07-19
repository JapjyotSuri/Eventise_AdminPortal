import React from "react";
import { CiLocationOn } from "react-icons/ci";
const EventCard = ({ event, showDescriptionHandler ,pathTaken}) => {
  function descriptionHandler() {
    showDescriptionHandler(true, event);
  }
  function colorDetermine(status) {
    switch (status) {
      case "pending":
        return "bg-yellow-400";
      case "Approved":
        return "bg-green-400";
      case "Rejected":
        return "bg-red-400";
    }
  }
  return (
    <div
      className="w-[400px] h-auto m-4 p-4 flex items-center justify-center flex-col rounded-2xl shadow-md bg-gray-white hover:shadow-lg hover:scale-105 transition-transform duration-300"
      onClick={() => descriptionHandler(event)}
    >
      <img
        src={event.imgUrl}
        alt="Event image"
        className=" shadow-md rounded-2xl w-[400px] h-[200px]"
      />
      <div className="w-[100%] flex flex-col">
        <div className="w-[100%] flex justify-between items-start bg-white">
          <h1 className="text-gray-400 text-[17px]">
            {event.date &&
              event.date
                .toDate()
                .toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
          </h1>
          <h1 className="text-gray-400 text-[17px]">
            Created by: {event.username}
          </h1>
        </div>
        <div className="w-[100%] flex justify-start items-start bg-white">
          <h1 className="text-[20px] font-bold">{event.title}</h1>
        </div>
      </div>
      <div className="flex w-[100%] justify-between i bg-white">
        <div className="flex gap-1 items-center">
          <CiLocationOn size={17} color="red" />
          <h1 className="text-gray-400 text-[17px]">{event.location}</h1>
        </div>
        <button
          className={` ${colorDetermine(
            event.status
          )} px-2 py-1 rounded-lg text-white `}
        >
          {event.status}
        </button>
      </div>
    </div>
  );
};

export default EventCard;

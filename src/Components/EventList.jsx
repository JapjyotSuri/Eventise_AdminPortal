import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import {
  collection,
  onSnapshot,
} from "@firebase/firestore";
import EventCard from "./EventCard";
import DescriptionPage from "./DescriptionPage";
const EventList = ({ eventFilter }) => {
  const [sortAccording, setSortAccording] = useState("Title");
  const [filteredList, setFilteredList] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventList, SetEventList] = useState(null);
  const [sortedEvents, setSortedEvents] = useState([]);
  function showDescriptionHandler(option, event) {
    setShowDescription(option);

    setCurrentEvent(event);
  }
  useEffect(() => {
    const eventCollection = collection(firestore, "events");
    const unsubscribe = onSnapshot(eventCollection, (snapshot) => {
      const eventsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(eventsList);
      SetEventList(eventsList);

      const filteredEvents = eventsList.filter((event) => {
        if (eventFilter === "pending") {
          return event.status === "pending";
        } else if (eventFilter === "rejected") {
          return event.status === "Rejected";
        } else if (eventFilter === "approved") {
          return event.status === "Approved";
        } else {
          return true;
        }
      });
      setFilteredList(filteredEvents);
      if (sortAccording === "Date") {
        const sortedDates = filteredEvents.sort((a, b) => {
          const dateA = a.date.toDate();
          const dateB = b.date.toDate();
          return dateA - dateB;
        });
        setSortedEvents(sortedDates);
      }
      if (sortAccording === "Title") {
        const sortedTitles = filteredEvents.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        setSortedEvents(sortedTitles);
      }
    });

    return () => unsubscribe();
  }, [firestore, eventFilter, sortAccording]);

  return (
    <div className="mt-3">
      {eventFilter === "all" && (
        <div className="w-[100%] flex justify-center items-center  text-[30px]">
          <h1>All Events</h1>
        </div>
      )}
      {eventFilter === "pending" && (
        <div className="w-[100%] flex justify-center items-center  text-[30px]">
          <h1>Pending Events</h1>
        </div>
      )}
      {eventFilter === "approved" && (
        <div className="w-[100%] flex justify-center items-center  text-[30px]">
          <h1>Approved Events</h1>
        </div>
      )}
      {eventFilter === "rejected" && (
        <div className="w-[100%] flex justify-center items-center  text-[30px]">
          <h1>Rejeted Events</h1>
        </div>
      )}
      <div className="w-[100%]  flex flex-row justify-start items-center ml-[6%] gap-2">
        <h1 className="text-[18px]">Sort by: </h1>
        <div>
          <select
            value={sortAccording}
            onChange={(e) => setSortAccording(e.target.value)}
            className="bg-transparent  w-[70px] py-1 rounded-md outline-none border focus:ring-2 focus:ring-white"
          >
            <option value="Title">Title</option>
            <option value="Date">Date</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center">
        {sortedEvents &&
          sortedEvents.map((event) => (
            <EventCard
              event={event}
              showDescriptionHandler={showDescriptionHandler}
            />
          ))}
        {sortedEvents && sortedEvents.length === 0 && (
          <div className="w-full h-[600px] flex justify-center items-center">
            <h1 className="text-[25px] ">No {eventFilter} events</h1>
          </div>
        )}
      </div>
      <div className="overlay">
        {showDescription && currentEvent && (
          <DescriptionPage
            currentEvent={currentEvent}
            showDescriptionHandler={showDescriptionHandler}
          />
        )}
      </div>
    </div>
  );
};

export default EventList;

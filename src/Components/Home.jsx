import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firestore } from "../firebase";
import {
  collection,
  getDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "@firebase/firestore";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { FaRegUserCircle } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Table from "./Table";
import EventList from "./EventList";
import UserList from "./UserList";

const Home = () => {
  const navigate = useNavigate();
  const [showEventsDrop, setShowEventsDrop] = useState(false);
  const [eventFilter, setEventFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdownProfile, setShowDropdownProfile] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const itemsPerPage = 6;
  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const LastIndex = itemsPerPage * page;
  const firstIndex = LastIndex - itemsPerPage;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentUsers = filtered.slice(firstIndex, LastIndex);

  const [CurrentUser, setCurrentUser] = useState(null); //storing info about current logged in user
  const [list, setList] = useState("users");
  function handleDropdownProfile() {
    setShowDropdownProfile(!showDropdownProfile);
  }
  useEffect(() => {
    //using onSnapshot here to get real time updates whenever some data in the firestore gets changed
    setIsLoading(true);
    const subscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log('user is' + JSON.stringify(user));
        try {
          async function getName() {
            //here we have to write this as user doesnt contain name as display name cpmes as null so we have to fetch data from firestore
            const docRef = doc(firestore, "users", user.uid);
            const data = await getDoc(docRef);
            if (data.exists()) {
              console.log(data.data());
              setName(data.data().name);
            }
          }
          getName();
        } catch (error) {
          if (error.code === "permission-denied") {
            alert("permission denied");
            navigate("/");
          } else {
            console.log("An unexpected error occurred:", error);
          }
        }
        setIsLoading(false);
        //    , (error) => {//here we had to write it like this and using try catch block doesnt catch the error as onSnapshot is an async function so try catch initially doesnt catch the error causing it not give alert

        //     });
      }
    });
    return () => {
      //    if(unsubscribe){
      //     unsubscribe();
      //    }
      subscribe();
    };
  }, [navigate]);
  async function handleLogout() {
    await signOut(auth);
    setCurrentUser(null);
    navigate("/");
  }
  return (
    <div className=" w-[100%] flex flex-col   min-h-screen  ">
      {isLoading ? (
        <div className="mt-[40px]">
          <div
            className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-700 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
        </div>
      ) : (
        <div className=" w-[100%] flex flex-col   overflow-x-hidden">
          <div className="w-[100%] h-[70px] bg-[#222322] flex flex-row justify-between items-center ">
            
            <div className="flex justify-start ml-5">
              <h1 className="text-[30px]  text-white">Admin Portal</h1>
            </div>
            <div className=" flex justify-center items-center gap-9">
              <button onClick={() => setList("users")}>
                <h1 className=" text-white text-[25px] ">Users</h1>
              </button>
              <div className="flex flex-col">
                {/* <button onClick={() => setList("events")}> */}
                <button
                  onClick={() => {
                    setShowEventsDrop(!showEventsDrop);
                  }}
                >
                  <h1 className=" text-white text-[25px]">Events</h1>
                </button>
                <div>
                  {showEventsDrop && (
                    <div
                      class="absolute  z-10 mt-4 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabindex="-1"
                    >
                      <a
                        href="#"
                        onClick={() => {
                          setEventFilter("all");
                          setList("events");
                        }}
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        role="menuitem"
                        tabindex="-1"
                        id="user-menu-item-0"
                      >
                        All Events
                      </a>
                      <a
                        href="#"
                        onClick={() => {
                          setEventFilter("pending");
                          setList("events");
                        }}
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        role="menuitem"
                        tabindex="-1"
                        id="user-menu-item-1"
                      >
                        Pending
                      </a>
                      <a
                        href="#"
                        onClick={() => {
                          setEventFilter("approved");
                          setList("events");
                        }}
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        role="menuitem"
                        tabindex="-1"
                        id="user-menu-item-2"
                      >
                        Approved
                      </a>
                      <a
                        href="#"
                        onClick={() => {
                          setEventFilter("rejected");
                          setList("events");
                        }}
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        role="menuitem"
                        tabindex="-1"
                        id="user-menu-item-2"
                      >
                        Rejected
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* <div onClick={handleLogout} className='bg-red-500  h-[70px] w-[175px] flex justify-center items-center'>
                                <h1 className='text-white text-[25px]'>Logout</h1>
                            </div> */}
            <div className="flex flex-col mr-2">
              <div
                className="flex flex-row justify-center items-center gap-2 mr-8 "
                onClick={() => handleDropdownProfile()}
              >
                <FaRegUserCircle className="h-[25px] w-[25px] text-white" />
                <h1 className="text-[25px] text-white">{name}</h1>
              </div>
              <div>
                {showDropdownProfile && (
                  <div
                    class="absolute right-2 z-10 mt-5 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabindex="-1"
                  >
                    <a
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                      role="menuitem"
                      tabindex="-1"
                      id="user-menu-item-0"
                    >
                      Your Profile
                    </a>
                    <a
                      href="#"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                      role="menuitem"
                      tabindex="-1"
                      id="user-menu-item-1"
                    >
                      Settings
                    </a>
                    <a
                      href="#"
                      onClick={handleLogout}
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                      role="menuitem"
                      tabindex="-1"
                      id="user-menu-item-2"
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>


          </div>
          <div>{list === "users" && <UserList />}</div>
          <div>
            {list === "events" && <EventList eventFilter={eventFilter} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

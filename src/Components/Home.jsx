import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firestore } from "../firebase";
import { getDoc, doc } from "@firebase/firestore";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import EventList from "./EventList";
import UserList from "./UserList";
import { FaRegHourglassHalf } from "react-icons/fa6";
import logo from "../logo-color__finalPic.png";
const Home = () => {
  const navigate = useNavigate();
  const [pathTaken,setPathTaken]=useState('events');
  const [showEventsDrop, setShowEventsDrop] = useState(false);
  const [eventFilter, setEventFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdownProfile, setShowDropdownProfile] = useState(false);
  const [name, setName] = useState("");

  const [CurrentUser, setCurrentUser] = useState(null); //storing info about current logged in user
  const [list, setList] = useState("users");
  function handleDropdownProfile() {
    setShowDropdownProfile(!showDropdownProfile);
  }
  useEffect(() => {

    setIsLoading(true)
    const subscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log('user is' + JSON.stringify(user));
        try {
          async function getName() {
            //here we have to write this as user doesnt contain name as display name comes as null so we have to fetch data from firestore
            const docRef = doc(firestore, "users", user.uid);
            const data = await getDoc(docRef);
            if (data.exists()) {
              console.log(data.data());
              setName(data.data().name);
            }
            
          }
          getName();
          setIsLoading(false);
        } catch (error) {
          console.log("An unexpected error occurred:", error);
        }
      }
      else{
        setIsLoading(false);
      }
    });
    return () => {
      subscribe();
    };
  }, [navigate,name]);
  async function handleLogout() {
    await signOut(auth);
    setCurrentUser(null);
    navigate("/");
  }
  function isActive(menuItem){
    return list === menuItem;
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
            <div className="flex justify-start  flex-row items-center ">
              <img src={logo} className="h-[160px] width:[70px] -ml-7" ></img>
              <h1 className="text-[30px] font-[600]  text-white -ml-9">Admin Portal</h1>
            </div>
            <div className=" flex justify-center items-center gap-9">
              <button onClick={() => setList("users")}>
                <h1  className={`text-white font-[500] text-[20px]  ${isActive("users") ? "border-b-2 border-white py-1" : ""
                    }`}>Users</h1>
              </button>
              <div className="flex flex-col">
                <button
                  onClick={() => {
                    setShowEventsDrop(!showEventsDrop);
                    setPathTaken('events')
                  }}
                  onMouseEnter={() => {
                    setShowEventsDrop(true)
                    setPathTaken('events')
                  }}
                >
                  <h1 className={`text-white font-[500] text-[20px]  ${isActive("events") ? "border-b-2 border-white py-1" : ""}`}>Events</h1>
                </button>
                <div>
                  {showEventsDrop && (
                    <div
                      onMouseEnter={() => {
                        setShowEventsDrop(true)
                        setPathTaken('events')
                      }}
                      onMouseLeave={() => setShowEventsDrop(false)}
                      class="absolute  z-10 mt-4 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none cursor-pointer"
                      role="menu"
                      tabindex="-1"
                    >
                      <div
                        onClick={() => {
                          setEventFilter("all");
                          setList("events");
                        }}
                        class="block px-4 py-2 text-[17px] text-gray-700 hover:bg-gray-200 duration-500 rounded"
                        role="menuitem"
                        tabindex="-1"
                        id="event-menu-item-0"
                      >
                        All Events
                      </div>
                      <div
                        onClick={() => {
                          setEventFilter("pending");
                          setList("events");
                        }}
                        class="block px-4 py-2 text-[17px] text-gray-700 hover:bg-gray-200 duration-500 rounded"
                        role="menuitem"
                        tabindex="-1"
                        id="event-menu-item-1"
                      >
                        Pending
                      </div>
                      <div
                        onClick={() => {
                          setEventFilter("approved");
                          setList("events");
                        }}
                        class="block px-4 py-2 text-[17px] text-gray-700 hover:bg-gray-200 duration-500 rounded"
                        role="menuitem"
                        tabindex="-1"
                        id="event-menu-item-2"
                      >
                        Approved
                      </div>
                      <div
                        onClick={() => {
                          setEventFilter("rejected");
                          setList("events");
                        }}
                        class="block px-4 py-2 text-[17px] text-gray-700 hover:bg-gray-200 duration-500 rounded"
                        role="menuitem"
                        tabindex="-1"
                        id="event-menu-item-3"
                      >
                        Rejected
                      </div>
                    </div>
                  )}
                </div>

              </div>
              <button onClick={() => {
                setList("registrations")
                setPathTaken('registrations')
                }}>
                <h1 className={`text-white font-[500] text-[20px]  ${isActive("registrations") ? "border-b-2 border-white py-1" : ""}`}>Registrations</h1>
              </button>
            </div>
            <div className="flex flex-col mr-2">
              <div
                className="flex flex-row justify-center items-center gap-2 mr-8 "
                onClick={() => handleDropdownProfile()}
                onMouseEnter={() => setShowDropdownProfile(true)}
              >
                <FaRegUserCircle className="h-[25px] w-[25px] text-white" />
                <h1 className="text-[25px] text-white">{name}</h1>
              </div>
              <div>
                {showDropdownProfile && (
                  <div
                    class="absolute right-2 z-10 mt-5 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none cursor-pointer"
                    role="menu"
                    tabindex="-1"//here giving it -1 makes it not focusable by keyboard navigation
                    onMouseEnter={() => setShowDropdownProfile(true)}
                    onMouseLeave={() => setShowDropdownProfile(false)}
                  >
                    <div
                      onClick={handleLogout}
                      class="block px-4 py-2 text-lg text-gray-700 hover:bg-red-600 hover:text-white font-[500] duration-500 rounded"
                      role="menuitem"
                      tabindex="-1"
                    >
                      Sign out
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>{list === "users" && <UserList />}</div>
          <div>
            {list === "events" && <EventList eventFilter={eventFilter} pathTaken={pathTaken}/>}
          </div>
          <div>{list === "registrations" && <EventList eventFilter="approved" pathTaken={pathTaken}/>}</div>
        </div>
      )}
    </div>
  );
};

export default Home;

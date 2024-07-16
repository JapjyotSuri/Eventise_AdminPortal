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
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Table from "./Table";

const UserList = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState("");
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
  let unsubscribe = null;
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
    if (search === "") {
      setFiltered(userList);
    } else {
      const newUsers = userList.filter((user) => {
        return (
          search &&
          (user.name.toLowerCase().includes(search) ||
            user.email.toLowerCase().includes(search))
        );
      });
      setFiltered(newUsers);
      setSearch("");
    }
  }

  useEffect(() => {
    //using onSnapshot here to get real time updates whenever some data in the firestore gets changed
    setIsLoading(true);
    const subscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log('user is' + JSON.stringify(user));

        const userCollection = collection(firestore, "users");
        const userQuery = query(userCollection, orderBy("name"));

        unsubscribe = onSnapshot(
          userQuery,
          (snapshot) => {
            const usersList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            let adminNumber = 0;
            usersList.map((user) => {
              if (user.role === 0) {
                adminNumber = adminNumber + 1;
              }
            });

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
            setAdminCount(adminNumber);
            setUserCount(usersList.length - adminNumber);
            setUserList(usersList);
            setFiltered(usersList);
            setIsLoading(false)
          },
          (error) => {
            //here we had to write it like this and using try catch block doesnt catch the error as onSnapshot is an async function so try catch initially doesnt catch the error causing it not give alert
            console.log("I am here");
            
            if (error.code === "permission-denied") {
                setIsLoading(false);
              alert("permission denied");
              navigate("/");
            } else {
              console.log("An unexpected error occurred:", error);
            }
          }
        );
      }
    
    
    
      
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      subscribe();
    };
  }, [navigate]);
  return (
    <div>
      {isLoading ? (
        <div className="mt-[40px]">
          <div
            className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-700 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
        </div>
      ) : (
        <div className="flex flex-col mt-3  w-[75%] ">
          <div className="flex flex-col justify-center items-start w-full ml-11">
            <div className="flex flex-col justify-start items-start gap-4 mt-4 mb-2">
              <h1 className="text-[30px]">Welcome back, {name} !!!!</h1>
              <p className="text-[17px]">
                Welcome to the Users List section! Here, you'll find all the
                information about the registered users.
              </p>
            </div>
            <div className="flex flex-row mt-5 justify-center gap-10 ">
              <div className=" bg-[#f1e2ff] rounded-lg w-[150px] h-[50px] flex justify-center items-center">
                <h1>Admin: {adminCount}</h1>
              </div>
              <div className=" bg-[#dcffdf] rounded-lg w-[150px] h-[50px] flex justify-center items-center">
                <h1>User: {userCount}</h1>
              </div>
            </div>
            <div className="w-full flex justify-start items-center ">
              <button onClick={handleSearch}>
                <FaSearch className="h-[25px] w-[25px]" />{" "}
              </button>
              <input
                type="text"
                onChange={(e) => handleSearchChange(e)}
                value={search}
                className="h-[40px] w-[85%] m-5 border-black px-4"
                placeholder="Search"
              />
            </div>

            <Table currentUsers={currentUsers} />

            <div className="flex flex-row w-[90%] ml-2 justify-center gap-11 mt-6 ">
              <button
                onClick={handlePrev}
                className="bg-[#f1e2ff] rounded-lg h-[40px] w-[150px]"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="bg-[#dcffdf] rounded-lg h-[40px] w-[150px]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;

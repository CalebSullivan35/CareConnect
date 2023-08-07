import React, { useState, useEffect } from "react";


export const NavBarGreeting = () => {
  const [currentUser, setCurrentUser] = useState({});
  //first get the current user.
  const localCapstoneUser = localStorage.getItem("capstone_user");
  const capstoneUserObject = JSON.parse(localCapstoneUser);
  // fetch profile information from the user.
  

  //function that chooses where to fetch based on if the capstoneUserObject is a provider

  const whereToFetch = () => {
    if (capstoneUserObject.isProvider) {
      fetch(`http://localhost:8088/providers?userId=${capstoneUserObject.id}`)
        .then((response) => response.json())
        .then((data) => {
          setCurrentUser(data[0]);
        });
    } else if (!capstoneUserObject.isProvider) {
      fetch(`http://localhost:8088/patients?userId=${capstoneUserObject.id}`)
        .then((response) => response.json())
        .then((data) => {
          setCurrentUser(data[0]);
        });
    }
  };
  useEffect(() => {
    whereToFetch();
  }, []);

  return (
    
    <h2 className="text-3xl font-mono absolute left-5"><i class="fa-solid fa-user-doctor"></i></h2>
    
  )
};

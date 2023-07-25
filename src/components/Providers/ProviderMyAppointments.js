import React, { useEffect, useState } from "react";
import { CreateNewAppointment } from "./CreateNewAppointment";

export const ProviderMyAppointments = () => {
 //current user info
 const localCapstoneUser = localStorage.getItem("capstone_user");
 const capstoneUserObject = JSON.parse(localCapstoneUser);

 const [showCreateAppointment, setShowCreateAppointment] = useState(false);
 const [allProviderAppointments, setAllProviderAppointments] = useState([]);
 const [scheduledProviderAppointments, setScheduledProviderAppointments] =
  useState([]);
 const [currentProvider, setCurrentProvider] = useState({});
 //fetch the current Provider
 useEffect(() => {
  fetch(`http://localhost:8088/providers?userId=${capstoneUserObject.id}`)
   .then((response) => response.json())
   .then((data) => {
    setCurrentProvider(data[0]);
   });
 }, []);
 //fetch available  of specific provider appointments.
 useEffect(() => {
  fetch(
   `http://localhost:8088/providerAllAppointments?providerid=${currentProvider.id}`
  )
   .then((response) => response.json())
   .then((data) => {
    setAllProviderAppointments(data);
   });
 }, [currentProvider]);
 //fetch the scheduled appointments

 const handleCreateAppointmentClick = () => {
  if (showCreateAppointment) {
   setShowCreateAppointment(false);
  } else {
   setShowCreateAppointment(true);
  }
 };

 return (
  <div className="flex flex-row">
   <div className="flex flex-col m-5" id="open Appointments">
    <h2 className="text-2xl underline">Open Appointments</h2>
    {allProviderAppointments.map((appointment) => {
     return (
      <div key={appointment.id} className=" mt-5 border-2 w-44 p-2">
       <p>Date: {appointment.date}</p>
       <p>Time: {appointment.time}</p>
       {/* TODO Implement Button functionality */}
       <button>Delete Appointment</button>
      </div>
     );
    })}
   </div>
   <div className="flex flex-col m-5" id="Scheduled Appointments">
    <h2 className="text-2xl underline">Scheduled Appointments</h2>
   </div>
   {}

     {showCreateAppointment ? <CreateNewAppointment currentProvider={currentProvider}
       setAllProviderAppointments={setAllProviderAppointments} /> : ""}
   <button
    className="absolute bottom-5 right-5"
    onClick={handleCreateAppointmentClick}
   >
    Create An Appointment
   </button>
  </div>
 );
};

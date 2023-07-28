import React, { useEffect, useState } from "react";
import { CreateNewAppointment } from "./CreateNewAppointment";
import { ProviderScheduledAppointments } from "./ProviderScheduledAppointments";

export const ProviderMyAppointments = () => {
 //current user info
 const localCapstoneUser = localStorage.getItem("capstone_user");
 const capstoneUserObject = JSON.parse(localCapstoneUser);

 const [showCreateAppointment, setShowCreateAppointment] = useState(false);
 const [allProviderAppointments, setAllProviderAppointments] = useState([]);
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
   `http://localhost:8088/providerAllAppointments?providerId=${currentProvider.id}`
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

 // function to handle the delete appointment
 const handleDelete = (appointment) => {
  fetch(`http://localhost:8088/providerAllAppointments/${appointment.id}`, {
   method: "DELETE",
  })
   .then((response) => response.json())
   .then((data) => {
    setAllProviderAppointments((prevAppointments) =>
     prevAppointments.filter((appt) => appt.id !== appointment.id)
    );
   });
 };

 return (
  <div className="flex flex-row justify-around bg-slate-200 h-screen">
   <div
    className="flex flex-col m-5 w-5/12 text-center"
    id="open Appointments"
   >
    <h2 className="text-4xl font-mono underline mb-5">Open Appointments</h2>
    <div className="flex flex-wrap justify-between">
     {allProviderAppointments.map((appointment) => {
      if (appointment.isAvailable === true) {
       return (
        <div
         key={appointment.id}
         className="mt-5 border-2 h-52 w-4/12 p-5 rounded-2xl bg-white"
        >
         <p className="text-xl mb-3">Date: {appointment.date}</p>
         <p className="text-xl mb-3">Time: {appointment.time}</p>
         <button
          className=" mt-10 text-lg buttonEffect border-2 px-2 py-1 rounded-lg"
          onClick={() => {
           handleDelete(appointment);
          }}
         >
          Delete Appointment
         </button>
        </div>
       );
      }
     })}
    </div>
   </div>
   <div className="flex flex-col m-5 w-5/12 h-fit" id="Scheduled Appointments">
    <h2 className="text-4xl font-mono underline text-center">
     Scheduled Appointments
    </h2>
    <ProviderScheduledAppointments
     currentProvider={currentProvider}
     setAllProviderAppointments={setAllProviderAppointments}
    />
   </div>

   {}

   {showCreateAppointment ? (
    <CreateNewAppointment
     setShowCreateAppointment={setShowCreateAppointment}
     currentProvider={currentProvider}
     setAllProviderAppointments={setAllProviderAppointments}
    />
   ) : (
    ""
   )}
   <button
    className="absolute top-20 right-5 buttonEffect border-2 bg-white px-2 py-1 rounded-2xl text-xl font-mono"
    onClick={handleCreateAppointmentClick}
   >
    Create An Appointment
   </button>
  </div>
 );
};

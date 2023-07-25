import { useEffect, useState } from "react";
import { OpeningsByProviders } from "./OpeningsByProvider";

export const PatientMyAppointments = () => {
 //get Current User
 const localCapstoneUser = localStorage.getItem("capstone_user");
 const capstoneUserObject = JSON.parse(localCapstoneUser);
 const [userAsPatient, setUserAsPatient] = useState({});
 const [myScheduledAppointments, setMyScheduledAppointments] = useState([]);

 //get current user as patient
 useEffect(() => {
  fetch(`http://localhost:8088/patients?userId=${capstoneUserObject.id}`)
   .then((response) => response.json())
   .then((data) => {
    setUserAsPatient(data[0]);
   });
 }, []);

 // Get list of scheduled appointments based off the patient id
 useEffect(() => {
  fetch(
   `http://localhost:8088/scheduledAppointments?patientId=${userAsPatient.id}&_expand=providerAllAppointments&_expand=provider`
  )
   .then((response) => response.json())
   .then((data) => {
    setMyScheduledAppointments(data);
   });
 }, [userAsPatient]);

 //Handle Cancel AppointmentButton
 const handleCancelAppointmentButton = (appointment) => {
  fetch(`http://localhost:8088/scheduledAppointments/${appointment.id}`, {
   method: "DELETE",
  })
   .then((response) => response.json())
   .then(() => {
    // Refetch the provider relationships after successful deletion
    fetch(
     `http://localhost:8088/scheduledAppointments?patientId=${userAsPatient.id}&_expand=providerAllAppointments&_expand=provider`
    )
     .then((response) => response.json())
     .then((data) => {
      setMyScheduledAppointments(data);
     });
   });
 };

 return (
  <div className="flex flex-col justify-evenly">
   <h1 className="text-center text-5xl mt-5 mb-5">Appointment Manager</h1>
   <div className="flex flex-row justify-evenly">
    <div className="border-2 m-5 w-5/12">
     <h1 className="text-center">Your Scheduled Appointments.</h1>
     <div>
      {myScheduledAppointments.map((appointment) => {
       return (
        <div className="border-2 m-5 p-5">
         <h3>
          Scheduled: {appointment?.providerAllAppointments?.date}{" "}
          {appointment?.providerAllAppointments?.time}
         </h3>
         <h3>Provider : {appointment?.provider?.fullName}</h3>
         <h3>Specialty: {appointment?.provider?.specialty}</h3>
         <h3>Education: {appointment?.provider?.education}</h3>
         <div className="flex flex-row justify-between">
          <h3>Reason: {appointment?.PrimaryComplaint}</h3>
          <button
           className="text-red-400 mr-5"
           onClick={() =>
            handleCancelAppointmentButton(appointment, userAsPatient)
           }
          >
           Cancel Appointment
          </button>
         </div>
        </div>
       );
      })}
     </div>
    </div>
    <div className="border-2 m-5 w-5/12">
     <h1 className="text-center">Current Openings!</h1>
     <OpeningsByProviders
      capstoneUserObject={capstoneUserObject}
      userAsPatient={userAsPatient}
     />
    </div>
   </div>
  </div>
 );
};

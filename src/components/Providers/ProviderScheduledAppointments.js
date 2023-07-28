import { useEffect, useState } from "react";

export const ProviderScheduledAppointments = ({
 currentProvider,
 setAllProviderAppointments,
}) => {
 const [scheduledProviderAppointments, setScheduledProviderAppointments] =
  useState([]);
 useEffect(() => {
  fetch(
   `http://localhost:8088/scheduledAppointments?providerId=${currentProvider.id}&_expand=providerAllAppointments&_expand=patient`
  )
   .then((response) => response.json())
   .then((data) => {
    setScheduledProviderAppointments(data);
   });
 }, [currentProvider]);

 // function that will handle cancel appointment, will delete both the scheduled appointment and the matching all appointment.
 const handleCancel = (appointment) => {
  fetch(`http://localhost:8088/scheduledAppointments/${appointment.id}`, {
   method: "DELETE",
  })
   .then((response) => response.json())
   //refetch the scheduled appointments after deleting and reRender to the screen.
   .then(() => {
    fetch(
     `http://localhost:8088/scheduledAppointments?providerId=${currentProvider.id}&_expand=providerAllAppointments&_expand=patient`
    )
     .then((response) => response.json())
     .then((data) => {
      setScheduledProviderAppointments(data);
     });
   })
   .then(() => {
    fetch(
     `http://localhost:8088/providerAllAppointments/${appointment.providerAllAppointmentsId}`,
     {
      method: "DELETE",
     }
    )
     .then((response) => response.json())
     .then(() => {
      //refecth and update all my current appointments that arent scheduled.
      fetch(
       `http://localhost:8088/providerAllAppointments?providerId=${currentProvider.id}`
      )
       .then((response) => response.json())
       .then((data) => {
        setAllProviderAppointments(data);
       });
     });
   });
 };

 return (
  <div>
   <div className="mt-5">
    {scheduledProviderAppointments.map((appointment) => {
     return (
      <div key={appointment.id} className="mb-5 w-5/12 border-2 bg-white rounded-2xl p-5">
       <div className="flex flex-row text-2xl font-semibold text-center justify-center w-full">
        <p> Date: {appointment?.providerAllAppointments?.date}</p>
        <p className="ml-5">
         {" "}
         Time: {appointment?.providerAllAppointments?.time}
        </p>
       </div>
       <div className="text-xl mb-5">
        <p className="mt-5 mb-5">Patient: {appointment?.patient?.fullName}</p>
        <p>Primary Complaint: {appointment?.PrimaryComplaint}</p>
       </div>
       <div className="w-full flex justify-center">
        <button
         className="text-red-500 text-xl buttonEffect px-2 border rounded-lg py-1"
         onClick={() => {
          handleCancel(appointment);
         }}
        >
         Cancel Appointment
        </button>
       </div>
      </div>
     );
    })}
   </div>
  </div>
 );
};

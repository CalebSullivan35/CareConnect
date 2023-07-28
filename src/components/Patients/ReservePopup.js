import { useEffect, useState } from "react";

export const ReservePopup = ({
 setReservePopup,
 appointmentToSend,
 setAppointmentToSend,
 userAsPatient,
 setMyScheduledAppointments,
 setProviderSpecificAvailableAppointments,
 selectedProvider,
}) => {
 const [patientPrimaryComplaint, setPatientPrimaryComplaint] = useState("");
 const [readyToPost, setReadyToPost] = useState(false);
 const [appointmentToPut, setAppointmentToPut] = useState({});
 const [wasPosted, setWasPosted] = useState(false);
 const [readyToPut, setReadyToPut] = useState(false);
 const [wasPutted, setWasPutted] = useState(false);

 // Fetch the matching appointment to the appointment we are going to post. We will do a put with this later

 useEffect(() => {
  fetch(
   `http://localhost:8088/providerAllAppointments/${appointmentToSend.providerAllAppointmentsId}`
  )
   .then((response) => response.json())
   .then((data) => {
    const updatedData = { ...data, isAvailable: false };
    console.log("appointment To Put =", updatedData);
    setAppointmentToPut(updatedData);
   });
 }, [appointmentToSend]);

 // after the post we will use a use effect to then put the matching apppointment.
 useEffect(() => {
  if (wasPosted) {
   fetch(
    `http://localhost:8088/providerAllAppointments/${appointmentToPut.id}`,
    {
     method: "PUT",
     headers: {
      "Content-Type": "application/json",
     },
     body: JSON.stringify(appointmentToPut), // Use appointmentToPut data for the PUT request
    }
   )
    .then((response) => response.json())
    .then(() => {
     setWasPutted(true);
     setWasPosted(false);
    });
  }
 }, [wasPosted]);

 //  use effect to filter the list of appointments based on if they are available or not.
 useEffect(() => {
  fetch(
   `http://localhost:8088/providerAllAppointments?providerId=${selectedProvider.id}&isAvailable=true`
  )
   .then((response) => response.json())
   .then((data) => {
    setProviderSpecificAvailableAppointments(data);
   })
   
 }, [wasPutted]);

 //use Effect that will post, only when readyToPost is true
 useEffect(() => {
  if (readyToPost) {
   fetch("http://localhost:8088/scheduledAppointments", {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify(appointmentToSend),
   }).then(() => {
    setReadyToPost(false);
    setWasPosted(true);
   });
  }
 }, [readyToPost]);

 //use Effect that will re render when it sees something was posted it will refetch my scheduled appointments.
 useEffect(() => {
  if (wasPosted) {
   fetch(
    `http://localhost:8088/scheduledAppointments?patientId=${userAsPatient.id}&_expand=providerAllAppointments&_expand=provider`
   )
    .then((response) => response.json())
    .then((data) => {
     setMyScheduledAppointments(data);
    })
    .then(() => {
     setWasPosted(false);
    });
  }
 }, [wasPosted]);

 //saves the  primary complaint on change
 const handlePrimaryComplaintChange = (event) => {
  setPatientPrimaryComplaint(event.target.value);
 };

 //Do the post in here.
 const handleScheduleButton = () => {
  setAppointmentToSend((prevState) => ({
   ...prevState,
   PrimaryComplaint: patientPrimaryComplaint,
  }));
  setReadyToPost(true);
 };


 return (
  <div className="fixed inset-0 flex flex-col items-center justify-center text-center">
   <div className="bg-white p-10 rounded-xl shadow-2xl">
    <h3 className="mb-5 text-2xl font-mono font-bold">Please Enter Your Primary Complaint</h3>
    <input
     type="text"
     className="mb-7 mt-5 text-center w-9/12 h-10 rounded-md border-2 border-slate-500"
     name="complaint"
     placeholder="Primary Complaint"
     value={patientPrimaryComplaint}
     onChange={handlePrimaryComplaintChange}
    />
    <div className="flex justify-evenly">
     <button
      className="border-2 p-1 px-2 rounded-lg shadow-sm buttonEffect text-blue-500"
           onClick={() => {
             handleScheduleButton();
             setTimeout(() =>  setReservePopup(false), 300 ) 
           }
           }
     >
      Schedule
     </button>
     <button
      className="border-2 p-1 px-2 rounded-lg shadow-sm buttonEffect text-red-400"
      onClick={() => {
        setReservePopup(false);
      }}
     >
      Cancel
     </button>
    </div>
   </div>
  </div>
 );
};

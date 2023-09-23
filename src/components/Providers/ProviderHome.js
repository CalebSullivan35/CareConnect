import { useEffect, useState } from "react";
import { ChatContainer } from "../PatientChat/ChatContainer";
import { ProviderChatContainer } from "../ProviderChat/ProviderChatContainer";
import FadeIn from "react-fade-in/lib/FadeIn";

export const ProviderHome = () => {
 const localCapstoneUser = localStorage.getItem("capstone_user");
 const capstoneUserObject = JSON.parse(localCapstoneUser);
 const [myPatients, setMyPatients] = useState([]);
 const [userAsProvider, setUserAsProvider] = useState({});
  const [showPopUp, setShopPopUp] = useState(false);
  const [myScheduledAppointments, setMyScheduledAppointments] = useState([]);

 //fetch current provider as user
 useEffect(() => {
  fetch(`http://localhost:8088/providers?userId=${capstoneUserObject.id}`)
   .then((response) => response.json())
   .then((data) => {
    setUserAsProvider(data[0]);
   });
 }, []);

 //Get List of current assigned Patients
 useEffect(() => {
  fetch(
   `http://localhost:8088/providerPatientRelationships?providerId=${userAsProvider.id}&_expand=provider&_expand=patient`
  )
   .then((response) => response.json())
   .then((data) => {
    setMyPatients(data);
   });
 }, [userAsProvider]);
  
   // Get list of scheduled appointments based off the patient id
 useEffect(() => {
  fetch(
   `http://localhost:8088/scheduledAppointments?providerId=${userAsProvider.id}&_expand=providerAllAppointments&_expand=patient&_expand=provider`
  )
   .then((response) => response.json())
   .then((data) => {
    setMyScheduledAppointments(data);
   });
 }, [userAsProvider]);

 const handleShowPopUp = () => {
  if (!showPopUp) {
   setShopPopUp(true);
  } else {
   setShopPopUp(false);
  }
 };

 return (
  <div className="w-screen h-screen bg-neutral-content">
   <h1 className="font-extrabold font-mono text-6xl mt-5 ml-5">CareXpress</h1>
   <p className="font-bold font-mono text-3xl mt-5 ml-8">
    Welcome! <span className="italic underline">{userAsProvider?.fullName}</span>
   </p>
   <button
     className="font-extrabold font-mono text-4xl mt-5 ml-5 mr-10 border-2 px-3 py-2 rounded-xl buttonEffect bg-primary absolute bottom-4 right-5"
     onClick={handleShowPopUp}
    >
    <i class="fa-solid fa-message"></i> Messages
    </button>
   <ProviderChatContainer showPopUp={showPopUp} myPatients={myPatients} />
   <div className="flex flex-row w-screen align-middle justify-evenly">
    <FadeIn className="w-2/6 bg-white mt-20 rounded-3xl p-5 h-fit">
     <h1 className="text-center font-mono text-5xl mb-4 font-bold">
      Upcoming Appointments
     </h1>
     {myScheduledAppointments.length > 0 ? (
           myScheduledAppointments.map((appointment) => {
        console.log(appointment)
       return (
        <div className="collapse bg-base-200 p-2 mt-4" key={appointment.id}>
         <input type="checkbox" />
         <div className="collapse-title text-xl font-medium text-center">
          Date: {appointment?.providerAllAppointments?.date} Time:{" "}
          {appointment?.providerAllAppointments?.time}
         </div>
         <div className="collapse-content">
          <p className="text-3xl font-mono">
           Patient: {appointment?.patient?.fullName}
          </p>
          <p className="text-3xl font-mono">
           Location: {appointment?.provider?.address || "N/A"}
          </p>
          <p className="text-3x; font-mono">
           Complaint: {appointment?.PrimaryComplaint || "N/A"}
          </p>
         </div>
        </div>
       );
      })
     ) : (
      <p className="text-4xl text-center">No scheduled appointments currently.</p>
     )}
    </FadeIn>
   </div>
  </div>
 );
};

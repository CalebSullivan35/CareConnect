import { useEffect, useState } from "react";
import FadeIn from "react-fade-in";
import { UNSAFE_DataRouterStateContext } from "react-router-dom";
import { Chat } from "../PatientChat/IndividualChat";
import { ListConversations } from "../PatientChat/ListConversations";
import { ChatContainer } from "../PatientChat/ChatContainer";

export const PatientHome = () => {
 const localCapstoneUser = localStorage.getItem("capstone_user");
 const capstoneUserObject = JSON.parse(localCapstoneUser);
 const [userAsPatient, setUserAsPatient] = useState({});
 const [myScheduledAppointments, setMyScheduledAppointments] = useState([]);
 const [myProviders, setMyProviders] = useState([]);
 const [showPopUp, setShopPopUp] = useState(false);

 //list our upcoming 3 appointments.
 //list our current patient info in a drawer.... That way we see some info

 //set as current patient
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
 //Get List of current assigned Providers
 useEffect(() => {
  fetch(
   `http://localhost:8088/providerPatientRelationships?patientId=${userAsPatient.id}&_expand=provider&_expand=patient`
  )
   .then((response) => response.json())
   .then((data) => {
    setMyProviders(data);
   });
 }, [userAsPatient]);
 //function to handle show provider List for messaging
 const handleShowPopUp = () => {
  if (!showPopUp) {
   setShopPopUp(true);
  } else {
   setShopPopUp(false);
  }
 };

 return (
  <div className="bg-base-200 w-screen h-screen flex flex-col font-mono">
   <div className="flex flex-row justify-between">
    <h1 className="font-extrabold font-mono text-6xl mt-5 ml-5">
     CareConnect <i class="fa-solid fa-circle-nodes fa-sm"></i>
    </h1>
    <button
     className="btn btn-primary font-extrabold  text-4xl mr-10 border-2 absolute bottom-4 right-5"
     onClick={handleShowPopUp}
    >
     <i class="fa-solid fa-message"></i> Messages
    </button>
    <ChatContainer showPopUp={showPopUp} myProviders={myProviders} />
   </div>
   <div className="flex flex-row w-screen align-middle justify-evenly">
    <FadeIn className="w-2/6 bg-white mt-20 rounded-3xl p-5 h-fit">
     <h1 className="text-center font-mono text-4xl mb-4 font-bold">
      Upcoming Appointments
     </h1>
     {myScheduledAppointments.length > 0 ? (
      myScheduledAppointments.map((appointment) => {
       return (
        <div className="collapse bg-base-200 p-2 mt-4" key={appointment.id}>
         <input type="checkbox" />
         <div className="collapse-title text-2xl font-medium text-center">
          Date: {appointment?.providerAllAppointments?.date} Time:{" "}
          {appointment?.providerAllAppointments?.time}
         </div>
         <div className="collapse-content">
          <p className="text-3xl font-mono">
           Provider: {appointment?.provider?.fullName}
          </p>
          <p className="text-3xl font-mono">
           Location: {appointment?.provider?.address || "N/A"}
          </p>
          <p className="text-xl font-mono">
           Chief Complaint: {appointment?.PrimaryComplaint || "N/A"}
          </p>
         </div>
        </div>
       );
      })
     ) : (
      <p className="text-3xl text-center">No scheduled appointments.</p>
     )}
    </FadeIn>
    <FadeIn className="w-2/6 bg-white mt-20 rounded-3xl p-5 h-fit">
     <h2 className="text-center font-mono text-4xl mb-4 font-bold">
      My Providers
     </h2>
     {myProviders.length > 0 ? (
      myProviders.map((provider) => {
       return (
        <div className="collapse bg-base-200 p-2 mt-4" key={provider.id}>
         <input type="checkbox" />
         <div className="collapse-title text-4xl font-medium text-center">
          {provider?.provider?.fullName}
         </div>
         <div className="collapse-content">
          <p className="text-2xl font-mono">
           Specialty: {provider?.provider?.specialty}
          </p>
          <p className="text-2xl font-mono">
           Office Location: {provider?.provider?.address || "N/A"}
          </p>
          <p className="text-3x; font-mono"></p>
         </div>
        </div>
       );
      })
     ) : (
      <p className="text-3xl text-center">No Saved Providers</p>
     )}
    </FadeIn>
   </div>
  </div>
 );
};

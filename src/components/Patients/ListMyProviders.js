import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FadeIn from "react-fade-in";

export const ListMyProviders = () => {
 const navigate = useNavigate();
 const localCapstoneUser = localStorage.getItem("capstone_user");
 const capstoneUserObject = JSON.parse(localCapstoneUser);
 const [myRelationships, setRelationships] = useState([]);
 const [currentPatient, setCurrentPatient] = useState({});
 const [providers, setProviders] = useState([]);

 // get current patient from user
 useEffect(() => {
  fetch(`http://localhost:8088/patients?userId=${capstoneUserObject.id}`)
   .then((response) => response.json())
   .then((data) => {
    setCurrentPatient(data[0]);
   });
 }, []);
 //fetchest all the providers and expands upon the user.
 useEffect(() => {
  fetch(`http://localhost:8088/providers?_expand=user`)
   .then((response) => response.json())
   .then((data) => setProviders(data));
 }, [currentPatient]);

 //fetches relationships
 useEffect(() => {
  fetch(
   `http://localhost:8088/providerPatientRelationships?patientId=${currentPatient.id}&_expand=provider`
  )
   .then((response) => response.json())
   .then((data) => {
    setRelationships(data);
   });
 }, [providers]);

 const handleDeleteButton = async (relationship) => {
  try {
   const response = await fetch(
    `http://localhost:8088/scheduledAppointments?patientId=${currentPatient.id}&providerId=${relationship.providerId}&_expand=providerAllAppointments`
   );
   const data = await response.json();
   const putRequests = data.map((appointment) =>
    fetch(
     `http://localhost:8088/providerAllAppointments/${appointment.providerAllAppointmentsId}`,
     {
      method: "PUT",
      headers: {
       "Content-Type": "application/json",
      },
      body: JSON.stringify({
       providerId: appointment?.providerAllAppointments?.providerId,
       date: appointment?.providerAllAppointments?.date,
       time: appointment?.providerAllAppointments?.time,
       isAvailable: true,
      }),
     }
    ).then((response) => response.json())
   );

   await Promise.all(putRequests);

   const deleteRequests = data.map((appointment) =>
    fetch(`http://localHost:8088/scheduledAppointments/${appointment.id}`, {
     method: "DELETE",
    }).then((response) => response.json())
   );

   await Promise.all(deleteRequests);

   await fetch(
    `http://localhost:8088/providerPatientRelationships/${relationship.id}`,
    {
     method: "DELETE",
    }
   );

   // Refetch the provider relationships after successful deletion
   const relationshipResponse = await fetch(
    `http://localhost:8088/providerPatientRelationships?patientId=${currentPatient.id}&_expand=provider`
   );
   const relationshipData = await relationshipResponse.json();
   setRelationships(relationshipData);
  } catch (error) {
   console.error("Error occurred:", error);
  }
 };
 if (myRelationships < 1) {
  return (
   <div className="bg-base-200 flex flex-col items-center">
    <h1 className="text-4xl text-center mt-40">
     {" "}
     You have No Assigned Providers{" "}
    </h1>
    <button
     className="mt-5 text-xl rounded-lg border-2 w-75 px-4 buttonEffect bg-slate-600 text-white py-1"
     onClick={() => {
      navigate("/ListAllProviders");
     }}
    >
     Find New Providers
    </button>
   </div>
  );
 } else {
  return (
   <div className="bg-base-200">
    <div className="flex justify-start ml-10">
     <button
      className=" mt-5 text-xl rounded-lg border-2 w-30 px-4 buttonEffect bg-slate-600 text-white py-1"
      onClick={() => {
       navigate("/ListAllProviders");
      }}
     >
      Find New Providers
     </button>
    </div>
    <div className="flex justify-center w-screen">
     <FadeIn className="grid grid-cols-4 w-screen mx-96">
      {myRelationships.map((myRelationship) => {
       return (
        <li className="flex flex-col list-none m-5 border-2 bg-white border-black p-5 w-96 h-60 rounded-3xl">
         <div className="flex justify-center border-b border-black mb-2">
          <p className="mb-2 text-3xl">{myRelationship?.provider?.fullName}</p>
         </div>
         <p className="mb-2 text-xl">
          Education: {myRelationship?.provider?.education}
         </p>
         <p className="mb-2 text-xl">
          Specialty: {myRelationship?.provider?.specialty}
         </p>
         <div className="flex justify-center">
          <button
           className="text-white text-xl border border-black px-3 rounded-lg py-1 mt-5 buttonEffect bg-red-400"
           onClick={() => handleDeleteButton(myRelationship)}
          >
           Leave Provider
          </button>
         </div>
        </li>
       );
      })}
     </FadeIn>
    </div>
   </div>
  );
 }
};

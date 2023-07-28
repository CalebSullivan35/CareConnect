import { useEffect, useState } from "react";

export const ListAllProviders = () => {
 //current user
 const localCapstoneUser = localStorage.getItem("capstone_user");
 const capstoneUserObject = JSON.parse(localCapstoneUser);
 const [providersList, SetProvidersList] = useState([]);
 const [currentPatient, setCurrentPatient] = useState({});
 const [
  currentProviderPatientRelationships,
  setCurrentProviderPatientRelationships,
 ] = useState([]);
 // fetch all of the current providers.
 useEffect(() => {
  fetch(`http://localhost:8088/Providers?_expand=user`)
   .then((response) => response.json())
   .then((data) => {
    SetProvidersList(data);
   });
 }, []);
 // get current patient from user
 useEffect(() => {
  fetch(`http://localhost:8088/Patients?userId=${capstoneUserObject.id}`)
   .then((response) => response.json())
   .then((data) => {
    setCurrentPatient(data[0]);
   });
 }, []);
 // get current ProviderPatientRelationships with the current user.
 useEffect(() => {
  fetch(
   `http://localhost:8088/ProviderPatientRelationships?patientId=${currentPatient.id}`
  )
   .then((response) => response.json())
   .then((data) => {
    setCurrentProviderPatientRelationships(data);
   });
 });

 const handleBecomePatientButton = (provider) => {
  const dataToSendToApi = {
   providerId: provider.id,
   patientId: currentPatient.id,
  };
  return fetch("http://localhost:8088/ProviderPatientRelationships", {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify(dataToSendToApi),
  }).then((response) => response.json());
 };

 //function to check if the patient already has a relationship with the provider.
 const hasRelationship = (provider) => {
  return currentProviderPatientRelationships.some(
   (relationship) => relationship.providerId === provider.id
  );
 };

 return (
  <div className="w-screen h-screen  bg-slate-200">
     <h1 className="text-center text-5xl mt-4 font-mono">All Providers</h1>
     <div className="flex justify-center mt-10">
       {/* TODO Add functionality for Search Bar */}
     <input className = "w-3/12 h-10 rounded-xl p-4 text-xl" type="search" placeholder="Search For A Provider..." />
     </div>
   <div className="flex flex-wrap justify-evenly mt-10 ">
    {providersList.map((provider) => {
     return (
      <li className=" list-none m-5 border-2 bg-white border-black p-5 w-3/12 h-60 rounded-3xl">
       <div className="border-b w-100 p-2 mb-2">
        <p className="mb-1 font-mono text-3xl text-center ">
         {provider.fullName}
        </p>
       </div>
       <p className="mb-2 text-xl">Education: {provider.education}</p>
       <p className="mb-2 text-xl">Specialty: {provider.specialty}</p>
       <div className="flex justify-center mt-5">
        {hasRelationship(provider) ? (
         <p className="text-lg text-green-600 font-semibold">This is one of your current providers.</p>
        ) : (
         <button
          className="text-white hover:bg-slate-500 text-center border px-2 py-1 rounded-lg bg-slate-600 text-lg buttonEffect"
          onClick={() => handleBecomePatientButton(provider)}
         >
          Become Patient
         </button>
        )}
       </div>
      </li>
     );
    })}
   </div>
  </div>
 );
};

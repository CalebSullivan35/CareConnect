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
  <>
  <h1 className="text-center text-5xl mt-4 underline">All Providers</h1>
  <div className="flex flex-wrap justify-around mt-10">
   {providersList.map((provider) => {
    return (
     <li className=" list-none m-5 border-2 border-black p-5 w-5/12">
      <p className="mb-2">Name: {provider.fullName}</p>
      <p className="mb-2">Education: {provider.education}</p>
      <p className="mb-2">Specialty: {provider.specialty}</p>

      {hasRelationship(provider) ? (
       <p>This is one of your current providers.</p>
      ) : (
       <button
        className="text-blue-700 hover:text-blue-400"
        onClick={() => handleBecomePatientButton(provider)}
       >
        Become Patient
       </button>
      )}
     </li>
    );
   })}
  </div>
  </>
 );
};

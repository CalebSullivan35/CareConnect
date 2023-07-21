import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ListMyProviders = () => {
 const navigate = useNavigate();
 const localCapstoneUser = localStorage.getItem("capstone_user");
 const capstoneUserObject = JSON.parse(localCapstoneUser);
 const [myRelationships, setRelationships] = useState([]);
 const [currentPatient, setCurrentPatient] = useState({});
 const [providers, setProviders] = useState([]);
 const [myProviders, setMyProviders] = useState([]);
 const [modifiedRelationships, setModifiedRelationships ] = useState([]);
 // get current patient from user
 useEffect(() => {
  fetch(`http://localhost:8088/Patients?userId=${capstoneUserObject.id}`)
   .then((response) => response.json())
   .then((data) => {
    setCurrentPatient(data[0]);
   });
 }, []);
 //fetchest all the providers and expands upon the user.
 useEffect(() => {
  fetch(`http://localhost:8088/Providers?_expand=user`)
   .then((response) => response.json())
   .then((data) => setProviders(data));
 }, []);

 //fetches relationships
 useEffect(() => {
  fetch(
   `http://localhost:8088/ProviderPatientRelationships?patientId=${currentPatient.id}&_expand=provider`
  )
   .then((response) => response.json())
   .then((data) => {
    setRelationships(data);
   });
 }, [providers, modifiedRelationships]);

 //filters down to get just my providers specific infomation
 useEffect(() => {
  const myProvidersInformations = providers.filter((provider) => {
   console.log(provider);
   return myRelationships.some(
    (relationship) => relationship.providerId === provider.id
   );
  });
  console.log(myProvidersInformations);
  setModifiedRelationships(myProvidersInformations);
 }, [myRelationships]);

 const findRelationshipBasedUponProviderId = (myProvider) => {
  const relationshipToDelete = myRelationships.find(
   (relationship) => relationship.providerId === myProvider.id
  );
  return relationshipToDelete.id;
 };
 const handleDeleteButton = (relationshipId) => {
  fetch(
   `http://localhost:8088/ProviderPatientRelationships/${relationshipId}`,
   {
    method: "DELETE",
   }
  );
 };

 return (
  <div className="flex flex-col items-center">
   <button
    className="mt-5 border-black border-2 w-30 px-2"
    onClick={() => {
     navigate("/ListAllProviders");
    }}
   >
    Find New Providers!
   </button>
   <div className="w-screen">
    {myProviders.map((myProvider) => {
     return (
      <li className=" list-none m-10 border-2 border-black p-5 w-screen">
       <p className="mb-2 ">Name: {myProvider?.user?.fullName}</p>
       <p className="mb-2">Education: {myProvider?.education}</p>
       <p className="mb-2">Specialty: {myProvider?.specialty}</p>
       <button
        onClick={() =>
         handleDeleteButton(findRelationshipBasedUponProviderId(myProvider))
        }
       >
        Leave Provider
       </button>
      </li>
     );
    })}
   </div>
  </div>
 );
};

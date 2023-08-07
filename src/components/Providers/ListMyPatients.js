import { useEffect, useState } from "react";
import FadeIn from "react-fade-in/lib/FadeIn";
import { useNavigate } from "react-router-dom";

export const ListMyPatients = () => {
 //get current user
 const localCapstoneUser = localStorage.getItem("capstone_user");
 const capstoneUserObject = JSON.parse(localCapstoneUser);
 const navigate = useNavigate();
 // use states
 const [currentProvider, setCurrentProvider] = useState({});
 const [myRelationships, setMyRelationships] = useState([]);
 //use effect to get the current provider
 useEffect(() => {
  fetch(`http://localhost:8088/providers?userId=${capstoneUserObject.id}`)
   .then((response) => response.json())
   .then((data) => {
    setCurrentProvider(data[0]);
   });
 }, []);
 //use effect to get the current list of my relationships based on my id and expand to get properties of patient.
 useEffect(() => {
  fetch(
   `http://localhost:8088/providerPatientRelationships?providerId=${currentProvider.id}&_expand=patient`
  )
   .then((response) => response.json())
   .then((data) => {
    setMyRelationships(data);
   });
 }, [currentProvider]);

 if (myRelationships.length < 1) {
  return (
   <div className="bg-base-200 flex flex-col  w-screen h-screen">
    <h1 className="text-4xl text-center mt-60">
     You Have No Patients Currently Assigned To You....
    </h1>
   </div>
  );
 } else {
  return (
   <div className="bg-base-200 h-screen">
    <div className="flex justify-center w-screen">
     <FadeIn className="grid grid-cols-3 w-screen mx-40">
      {myRelationships.map((relationship) => {
       return (
        <ul className="list-none m-10 border-2 bg-white border-black p-5 h-60 rounded-lg flex flex-col">
         <li className=" mb-3 text-3xl font-semibold font-mono border-b-2 text-center ">
          {relationship?.patient?.fullName}
         </li>
         <div className="flex flex-row justify-between">
          <div>
           <li className="text-2xl">
            {" "}
            Height: {relationship?.patient?.height} In
           </li>
           <li className="text-2xl">
            Weight: {relationship?.patient?.weight} Lbs
           </li>
           <li className="text-2xl">
            Address: {relationship?.patient?.address}
           </li>
          </div>
          <div>
           <img
            className=" w-40 h-40 border-2 border-black"
            src={relationship?.patient?.profileImage}
           />
          </div>
         </div>
        </ul>
       );
      })}
     </FadeIn>
    </div>
   </div>
  );
 }
};

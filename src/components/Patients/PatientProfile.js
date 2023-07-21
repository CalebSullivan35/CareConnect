import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const PatientProfile = () => {
 const navigate = useNavigate();

 const [currentPatient, setCurrentPatient] = useState(false);
 const localCapstoneUser = localStorage.getItem("capstone_user");
 const capstoneUserObject = JSON.parse(localCapstoneUser);
 const [patientProfileInformation, setPatientProfileInformation] = useState({
  id: 0,
  userId: capstoneUserObject.id,
  address: "",
  height: 0,
  weight: 0,
 });

 useEffect(() => {
  fetch(
   `http://localhost:8088/patients?_expand=user&userId=${capstoneUserObject.id}`
  )
   .then((response) => response.json())
   .then((data) => {
    // checks if there is already a matching patient based on the capstone user object id
    // if there isnt one then do nothing.
    if (data[0]) {
     setCurrentPatient(true);
     console.log(data);
     setPatientProfileInformation({
      id: data[0].id,
      fullName: data[0].fullName,
      userId: capstoneUserObject.id,
      address: data[0]?.address,
      height: data[0]?.height,
      weight: data[0]?.weight,
     });
    }
   });
 }, []);

 const handleSubmitButton = (event) => {
  event.preventDefault();

  if (currentPatient === false) {
   const patientProfileInfoToSendToApiAsPost = {
    userId: capstoneUserObject.id,
    fullName: patientProfileInformation.fullName,
    address: patientProfileInformation.address,
    height: parseInt(patientProfileInformation.height),
    weight: parseInt(patientProfileInformation.weight),
   };
   // Fetch to Post The object to the API
   return fetch("http://localhost:8088/Patients", {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify(patientProfileInfoToSendToApiAsPost),
   })
    .then((response) => response.json())
    .then(() => {
     navigate("http://localhost:3000/");
    });
  } else {
   const patientProfileInfoToSendToApiAsPut = {
    userId: capstoneUserObject.id,
    fullName: patientProfileInformation.fullName,
    address: patientProfileInformation.address,
    height: parseInt(patientProfileInformation.height),
    weight: parseInt(patientProfileInformation.weight),
   };
   return fetch(
    `http://localhost:8088/Patients/${patientProfileInformation.id}`,
    {
     method: "PUT",
     headers: {
      "Content-Type": "application/json",
     },
     body: JSON.stringify(patientProfileInfoToSendToApiAsPut),
    }
   )
    .then((response) => response.json())
    .then(() => {
     navigate("http://localhost:3000/");
    });
  }
 };

 return (
  <div className="flex flex-col w-screen justify-center align-middle items-center mt-20">
   <div className="flex flex-col items-center">
    <fieldset>
     <div className="mb-2 w-50">
      <label>Full Name: </label>
      <input
       required
       type="text"
       placeholder="Full name"
       value={patientProfileInformation.fullName}
       onChange={(event) => {
        setPatientProfileInformation((prevProfile) => ({
         ...prevProfile,
         fullName: event.target.value,
        }));
       }}
      />
     </div>
     <div className="mb-2 w-50">
      <label>Current Address: </label>
      <input
       required
       type="text"
       placeholder="Address"
       value={patientProfileInformation.address}
       onChange={(event) => {
        setPatientProfileInformation((prevProfile) => ({
         ...prevProfile,
         address: event.target.value,
        }));
       }}
      />
     </div>
     <div className="mb-2 w-50">
      <label>Current Height: </label>
      <input
       required
       className="w-20 w-50"
       type="number"
       placeholder="Height"
       value={patientProfileInformation.height}
       onChange={(event) => {
        setPatientProfileInformation((prevProfile) => ({
         ...prevProfile,
         height: event.target.value,
        }));
       }}
      />
     </div>
     <div className="mb-2">
      <label>Current Weight: </label>
      <input
       required
       className="w-20"
       type="number"
       max="20"
       placeholder="Weight"
       value={patientProfileInformation.weight}
       onChange={(event) => {
        setPatientProfileInformation((prevProfile) => ({
         ...prevProfile,
         weight: event.target.value,
        }));
       }}
      />
     </div>
    </fieldset>
    <button
     className="w-20"
     onClick={(event) => {
      handleSubmitButton(event);
     }}
    >
     Submit
    </button>
   </div>
  </div>
 );
};

import { useEffect, useState } from "react";

export const ProviderListConversations = ({
 showPatientList,
 myPatients,
 setShowIndividualChat,
 setShowPatientList,
 updateSelectedPatientToChat,
 selectedPatientToChat,
 selectedConversation,
 setSelectedConversation,
}) => {
 //find if there is a matching conversation, if there is not post a conversation....
 useEffect(() => {
  // Check if selectedProviderToChat exists and has an 'id' property
  if (selectedPatientToChat?.id) {
   fetch(
    `http://localhost:8088/conversations?providerPatientRelationshipsid=${selectedPatientToChat.id}`
   )
    .then((response) => response.json())
    .then((data) => {
     console.log("data", data);
     setSelectedConversation(data[0]);
     console.log("Checkdata", data[0]);
     if (data.length === 0 && !selectedConversation.id) {
      // No matching conversation and selectedConversation not set, create a new one
      fetch("http://localhost:8088/conversations", {
       method: "POST",
       headers: {
        "Content-Type": "application/json",
       },
       body: JSON.stringify({
        providerPatientRelationshipsid: selectedPatientToChat.id,
       }),
      })
       .then((response) => response.json())
       .then((data) => {
        setSelectedConversation(data);
       });
     }
    });
  }
 }, [selectedPatientToChat]);

 return (
   <div className={`${showPatientList ? "block" : "hidden"} w-full h-full z-50`}>
     <h1 className="text-center font-mono text-4xl mb-2 font-extrabold border-b-black border-2 bg-base-200">Patients</h1>
   {myPatients.map((patient) => {
    return (
     <div
      key={patient?.id}
      className="btn btn-neutral flex w-full  text-2xl border-2 mb-2  hover:cursor-pointer rounded-xl"
      onClick={() => {
        updateSelectedPatientToChat(patient);
       setShowPatientList(false);
       setShowIndividualChat(true);
      }}
     >
      <h1 className="mx-5 p-2 w-full text-left">Patient: {patient?.patient?.fullName}</h1>
     </div>
    );
   })}
  </div>
 );
};

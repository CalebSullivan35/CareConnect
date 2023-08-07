//We wanna list all of my providers As options to message.

import { useEffect, useState } from "react";

//first get the list of current providers.
export const ListConversations = ({
 showProviderList,
 myProviders,
 setShowIndividualChat,
 setShowProviderList,
 updateSelectedProviderToChat,
 selectedProviderToChat,
 selectedConversation,
 setSelectedConversation,
}) => {
 //find if there is a matching conversation, if there is not post a conversation....
 useEffect(() => {
  // Check if selectedProviderToChat exists and has an 'id' property
  if (selectedProviderToChat?.id) {
   fetch(
    `http://localhost:8088/conversations?providerPatientRelationshipsid=${selectedProviderToChat.id}`
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
        providerPatientRelationshipsid: selectedProviderToChat.id,
       }),
      })
       .then((response) => response.json())
       .then((data) => {
        setSelectedConversation(data);
       });
     }
    });
  }
 }, [selectedProviderToChat]);

 return (
  <div
   className={`${showProviderList ? "block" : "hidden"} w-full h-full z-50`}
   >
     <h1 className="text-center font-mono text-4xl mb-2 font-extrabold border-b-black border-2 bg-base-200">Providers</h1>
   {myProviders.map((provider) => {
    return (
     <div
      key={provider?.id}
      className="btn btn-neutral flex w-full text-2xl border-2 mb-2 hover:cursor-pointer rounded-xl"
      onClick={() => {
       updateSelectedProviderToChat(provider);
       setShowProviderList(false);
       setShowIndividualChat(true);
      }}
     >
      <h1 className="mx-5 p-2 w-full text-left">Provider: {provider?.provider?.fullName}</h1>
     </div>
    );
   })}
  </div>
 );
};

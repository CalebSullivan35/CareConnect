import { useEffect, useState } from "react";
import FadeIn from "react-fade-in/lib/FadeIn";

export const ProviderMessage = ({ selectedConversation, renderMessages }) => {
 //fetch all the current messages in the current conversation and post them
 const localCapstoneUser = localStorage.getItem("capstone_user");
 const capstoneUserObject = JSON.parse(localCapstoneUser);
 const [messages, setMessages] = useState([]);
 const [relationship, setRelationship] = useState({});

 //get the relationship id and expand on both the user and the provider in order to grab there names.
 useEffect(() => {
  fetch(
   `http://localhost:8088/providerPatientRelationships?id=${selectedConversation?.providerPatientRelationshipsid}&_expand=provider&_expand=patient`
  )
   .then((response) => response.json())
   .then((data) => {
    setRelationship(data[0]);
   })
   .catch((error) => {});
 }, [selectedConversation]);

 //Get the list of messages coorelating to current conversation
 useEffect(() => {
  fetch(
   `http://localhost:8088/messages?conversationId=${selectedConversation?.id}`
  )
   .then((response) => response.json())
   .then((data) => {
    setMessages(data);
    console.log("messages", data);
   });
 }, [selectedConversation, renderMessages]);

 return (
  <FadeIn className=" min-w-full h-4/5 overflow-auto">
   {messages.map((message) => {
    if (message.senderUserId === capstoneUserObject.id) {
     return (
      <div className="chat chat-end">
       <div className="chat-header">{relationship?.provider?.fullName}</div>

       <div className="chat-bubble text-xl">{message?.message}</div>
      </div>
     );
    } else {
     return (
      <div className="chat chat-start">
       <div className="chat-header">{relationship?.patient?.fullName}</div>

       <div className="chat-bubble">{message?.message}</div>
      </div>
     );
    }
   })}
  </FadeIn>
 );
};

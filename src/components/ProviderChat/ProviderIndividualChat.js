import { useEffect, useState } from "react";
import { ProviderMessage } from "./ProviderMessage";

export const ProviderIndividualChat = ({
 showIndividualChat,
 setShowIndividualChat,
 setShowPatientList,
 selectedPatientToChat,
 selectedConversation,
 setSelectedConversation,
 updateSelectedPatientToChat,
}) => {
 const localCapstoneUser = localStorage.getItem("capstone_user");
 const capstoneUserObject = JSON.parse(localCapstoneUser);

 const [messageToSend, setMessageToSend] = useState("");
 const [renderMessages, reRenderMessages] = useState(false);
 // function that will post a message to the matching conversation
 const handleMessage = () => {
  let recieverUser = null;

  if (capstoneUserObject.id !== selectedPatientToChat?.patient?.userId) {
   recieverUser = selectedPatientToChat.patient.userId;
  } else {
   recieverUser = selectedPatientToChat.patient.userId;
  }

  console.log("revieverUserID:", recieverUser);

  fetch("http://localhost:8088/messages", {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify({
    conversationId: selectedConversation.id,
    senderUserId: capstoneUserObject.id,
    recieverUserId: recieverUser,
    message: messageToSend,
   }),
  }).then(() => {
   setMessageToSend("");
  });
 };

 const handleRerender = () => {
  reRenderMessages((prevRenderMessages) => !prevRenderMessages);
 };

 return (
  <div className={`${showIndividualChat ? "block" : "hidden"} w-full h-full`}>
   <button className="bg-primary px-2 rounded-xl hover:bg-primary-focus"
    onClick={() => {
     setShowIndividualChat(false);
     setShowPatientList(true);
     setSelectedConversation({});
     updateSelectedPatientToChat({});
    }}
   >
    <i class="fa-solid fa-arrow-left button-primary"></i> Conversations
   </button>

   <ProviderMessage
    selectedConversation={selectedConversation}
    renderMessages={renderMessages}
   />

   <div className=" w-full flex h-20 pb-4 ">
    <div className="flex flex-col flex-grow">
     {" "}
     <textarea
      value={messageToSend}
      placeholder="Your Message"
      className="text-left w-full py-2 pl-5 resize-none border-2 appearance-none"
      onChange={(e) => setMessageToSend(e.target.value)}
     />
    </div>
    <button
     onClick={() => {
      handleMessage();
      setTimeout(() => {
       handleRerender();
      }, 500);
     }}
     className="border-l-2 text-center w-1/5 bg-primary buttonEffect"
    >
     Send
    </button>
   </div>
  </div>
 );
};

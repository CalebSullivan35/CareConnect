import { useState } from "react";
import { ProviderListConversations } from "./ProviderListConversations";
import { ProviderIndividualChat } from "./ProviderIndividualChat";

export const ProviderChatContainer = ({ showPopUp, myPatients }) => {
 const [showPatientList, setShowPatientList] = useState(true);
 const [showIndividualChat, setShowIndividualChat] = useState(false);
 const [selectedPatientToChat, updateSelectedPatientToChat] = useState({});
 const [selectedConversation, setSelectedConversation] = useState({});

 return (
  <div
  className={` p-1 rounded-xl flex flex-col border-2 items-center border-black bg-white font-mono text-xl chat-box absolute right-10 bottom-20 ${
    showPopUp ? "block" : "hidden"
   }`}
  >
   <ProviderListConversations
    myPatients={myPatients}
    showPatientList={showPatientList}
    setShowIndividualChat={setShowIndividualChat}
    setShowPatientList={setShowPatientList}
    selectedPatientToChat={selectedPatientToChat}
    updateSelectedPatientToChat={updateSelectedPatientToChat}
    selectedConversation={selectedConversation}
    setSelectedConversation={setSelectedConversation}
   />
   <ProviderIndividualChat
    showIndividualChat={showIndividualChat}
    setShowIndividualChat={setShowIndividualChat}
    setShowPatientList={setShowPatientList}
    selectedPatientToChat={selectedPatientToChat}
    updateSelectedPatientToChat={updateSelectedPatientToChat}
    selectedConversation={selectedConversation}
    setSelectedConversation={setSelectedConversation}
   />
  </div>
 );
};

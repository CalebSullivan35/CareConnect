import { useState } from "react";
import { ListConversations } from "./ListConversations";
import { IndividualChat } from "./IndividualChat";

export const ChatContainer = ({ showPopUp, myProviders }) => {
 const [showProviderList, setShowProviderList] = useState(true);
 const [showIndividualChat, setShowIndividualChat] = useState(false);
 const [selectedProviderToChat, updateSelectedProviderToChat] = useState({});
 const [selectedConversation, setSelectedConversation] = useState({});

 return (
  <div
   className={` p-1 rounded-xl flex flex-col border-2 items-center border-black bg-white font-mono text-xl chat-box absolute right-10 bottom-20 ${
    showPopUp ? "block" : "hidden"
   }`}
  >
   <ListConversations
    myProviders={myProviders}
    showProviderList={showProviderList}
    setShowIndividualChat={setShowIndividualChat}
    setShowProviderList={setShowProviderList}
    selectedProviderToChat={selectedProviderToChat}
    updateSelectedProviderToChat={updateSelectedProviderToChat}
    selectedConversation={selectedConversation}
    setSelectedConversation={setSelectedConversation}
   />
   <IndividualChat
    showIndividualChat={showIndividualChat}
    setShowIndividualChat={setShowIndividualChat}
    setShowProviderList={setShowProviderList}
    selectedProviderToChat={selectedProviderToChat}
    updateSelectedProviderToChat={updateSelectedProviderToChat}
    selectedConversation={selectedConversation}
    setSelectedConversation={setSelectedConversation}
   />
  </div>
 );
};

import { ProviderNav } from "./ProviderNav";
import { PatientNav } from "./PatientNav";

export const NavBar = () => {
 const localCapstoneUser = localStorage.getItem("capstone_user");
 const capstoneUserObject = JSON.parse(localCapstoneUser);
 if (capstoneUserObject.isProvider) {
  return (
   <header className="bg-indigo-500 border-b border-black px-4 py-2 flex justify-between items-center font-mono">
    <ProviderNav />
   </header>
  );
 } else {
  return (
   <header className="bg-indigo-300 border-b-2 border-black">
    <PatientNav />
   </header>
  );
 }
};

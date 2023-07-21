import { ProviderNav } from "./ProviderNav";
import { PatientNav } from "./PatientNav";

export const NavBar = () => {
 const localCapstoneUser = localStorage.getItem("capstone_user");
 const capstoneUserObject = JSON.parse(localCapstoneUser);
 if (capstoneUserObject.isProvider) {
  return (
   <header className=" bg-red-500 border-b-2 border-black">
    <ProviderNav />
   </header>
  );
 } else {
  return (
   <header className="bg-blue-500 border-b-2 border-black">
    <PatientNav />
   </header>
  );
 }
};

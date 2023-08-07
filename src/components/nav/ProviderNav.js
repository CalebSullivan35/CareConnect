import { Link, useNavigate } from "react-router-dom";
import { NavBarGreeting } from "./NavBarGreeting.js";
import FadeIn from "react-fade-in/lib/FadeIn.js";

export const ProviderNav = () => {
 const navigate = useNavigate();
 return (
  <div className="navbar bg-primary">
   <div className="flex-1">
    <a className="btn btn-ghost normal-case text-2xl">CareConnect <i class="fa-solid fa-circle-nodes fa-md"></i></a>
    <i className="fa-solid fa-user-doctor text-3xl"></i>
   </div>
   <div className="flex-none mr-5">
    <ul className="menu menu-horizontal px-1 text-2xl mr-5">
     <li className="text-m hover:text-slate-400 ">
      <Link to="/ProviderMyAppointments">My Appointments</Link>
     </li>
     <li className="text-m hover:text-slate-400 ">
      <Link to="/ListMyPatients">My Patients</Link>
     </li>
     <li>
      <details>
       <summary>Menu</summary>

       <ul className="p-2 bg-base-100 absolute">
        <li>
         <Link to="/ProviderHome">Home</Link>
        </li>
        <li className="text-m hover:text-slate-400 ">
         <Link to="/ProviderProfile">My Profile</Link>
        </li>
        <li className="text-m hover:text-slate-400  mr-5">
         <Link
          to=""
          onClick={() => {
           localStorage.removeItem("capstone_user");
           navigate("/", { replace: true });
          }}
         >
          Logout
         </Link>
        </li>
       </ul>
      </details>
     </li>
    </ul>
   </div>
  </div>
 
 );
};

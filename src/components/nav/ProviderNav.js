import { Link, useNavigate } from "react-router-dom";
export const ProviderNav = () => {
 const navigate = useNavigate();
 return (
  <ul className="flex mt-5 justify-end space-x-6 w-screen text-lg font-bold">
   <li className="text-m hover:text-slate-400">
    <Link>My Patients</Link>
   </li>
   <li className="text-m hover:text-slate-400">
    <Link>My Appointments</Link>
   </li>
   <li className="text-m hover:text-slate-400">
    <Link>My Profile</Link>
   </li>
   <li className="text-m hover:text-slate-400">
    <Link
     className="mr-5"
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
 );
};

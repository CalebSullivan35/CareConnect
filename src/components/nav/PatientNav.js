import { Link, useNavigate } from "react-router-dom";
import { NavBarGreeting } from "./NavBarGreeting.js";

export const PatientNav = () => {
  const navigate = useNavigate();
  return (
    <ul className="flex mt-5 justify-end space-x-6 w-screen text-lg font-bold p-3 pr-10">
      <NavBarGreeting />
      <li className="text-m hover:text-slate-400 link-underline">
        <Link to="/ListMyProviders">My Providers</Link>
      </li>
      <li className="text-m hover:text-slate-400 link-underline">
        <Link to="/PatientMyAppointments">My Appointments</Link>
      </li>
      <li className="text-m hover:text-slate-400 link-underline">
        <Link to="/PatientProfile">My Profile</Link>
      </li>
      <li className="text-m hover:text-slate-400 link-underline mr-5">
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
  );
};

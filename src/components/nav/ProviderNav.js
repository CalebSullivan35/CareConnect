import { Link, useNavigate } from "react-router-dom";
import { NavBarGreeting } from "./NavBarGreeting.js";

export const ProviderNav = () => {
  const navigate = useNavigate();
  return (
    <ul className="flex mt-xl justify-end space-x-6 w-screen text-lg font-bold p-2 pr-10">
      <NavBarGreeting />
      <li className="text-xl hover:text-slate-400 link-underline">
        <Link to="/ListMyPatients">My Patients</Link>
      </li>
      <li className="text-xl hover:text-slate-400 link-underline">
        <Link to="/ProviderMyAppointments">My Appointments</Link>
      </li>
      <li className="text-xl hover:text-slate-400 link-underline">
        <Link to="/ProviderProfile">My Profile</Link>
      </li>
      <li className="text-xl hover:text-slate-400 link-underline">
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

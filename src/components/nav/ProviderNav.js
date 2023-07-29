import { Link, useNavigate } from "react-router-dom";
import { NavBarGreeting } from "./NavBarGreeting.js";

export const ProviderNav = () => {
  const navigate = useNavigate();
  return (
    <div className="navbar bg-primary text-2xl">
      <div className="flex-1">
      <NavBarGreeting />
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 text-xl">
         
          <li>
                  <Link to="/ListMyPatients">My Patients</Link>
                </li>
                <li>
                  <Link to="/ProviderMyAppointments">My Appointments</Link>
                </li>
                <li>
                  {" "}
                  <Link to="/ProviderProfile">My Profile</Link>
                </li>
                <li>
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
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../auth/capstoneLogo.png";

export const Login = () => {
 const [providers, setProviders] = useState([]);
 const [patients, setPatients] = useState([]);
 const [email, set] = useState("");
 const [password, setPassword] = useState("");
 const navigate = useNavigate();
 //logic that if the user does not have a matching profile then they will be routed to the create profile screen.

 // use Effects to get the list of current providers and patients
 useEffect(() => {
  fetch(`http://localhost:8088/providers`)
   .then((response) => response.json())
   .then((data) => setProviders(data));
 }, []);
 useEffect(() => {
  fetch(`http://localhost:8088/patients`)
   .then((response) => response.json())
   .then((data) => setPatients(data));
 }, []);
 // a function that returns a matching patient or provider profle
 const doIHaveAProfile = (user) => {
  const profileCheck =
   providers.find((provider) => provider.userId === user.id) ||
   patients.find((patient) => patient.userId === user.id);
  return profileCheck;
 };

 const handleLogin = (e) => {
  e.preventDefault();

  return fetch(`http://localhost:8088/users?email=${email}`)
   .then((res) => res.json())
   .then((foundUsers) => {
    if (foundUsers.length === 1 && foundUsers[0].password === password) {
     const user = foundUsers[0];
     localStorage.setItem(
      "capstone_user",
      JSON.stringify({
       id: user.id,
       isProvider: user.isProvider,
      })
     );
     if (doIHaveAProfile(user)) {
      if (user.isProvider) {
       navigate("/ProviderHome");
      } else {
       navigate("/PatientHome");
      }
     } else {
      if (user.isProvider) {
       navigate("/ProviderProfile");
       window.alert("Please Complete new Profile Form");
      } else {
       navigate("/PatientProfile");
       setTimeout(() => {
        window.alert("Please Complete new Profile Form");
       }, 500);
      }
     }
    } else {
     window.alert("Invalid login");
    }
   });
 };

 return (
  <main className="flex flex-col w-screen h-screen align-center items-center bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 font-mono">
   <section className="">
    <h1 className=" font-extrabold text-6xl mt-20 text-center">
     <span className="text-8xl italic">C</span>are
     <span className="text-8xl italic">C</span>
     onnect <i class="fa-solid fa-circle-nodes fa-2xl"></i>
    </h1>
    <form
     className=" bg-white mt-32 border-2 p-10 rounded-3xl"
     onSubmit={handleLogin}
    >
     <h1 className="mb-10 font-bold text-center text-7xl py-2 border-b flex px-20 justify-evenly">
      <i class="fa-solid fa-user"></i>
      <span>Login</span>
     </h1>
     <fieldset className="mb-3">
      <div className="mb-3 flex justify-end text-xl items-center ">
       <label htmlFor="inputEmail" className="text-2xl font-semibold">
        Email:&nbsp;&nbsp;&nbsp;
       </label>
       <input
        type="email"
        value={email}
        onChange={(evt) => set(evt.target.value)}
        className="input input-bordered input-primary w-full max-w-xs font-semibold text-2xl"
        placeholder="Email address"
        required
        autoFocus
       />
      </div>
      <div className="mb-3 flex justify-between text-xl items-center">
       <label htmlFor="inputPassword" className="flex items-center">
        <p className="flex item-center mt-5 font-semibold text-2xl">
         Password: &nbsp;&nbsp;
        </p>
       </label>
       <input
        type="password"
        value={password}
        onChange={(evt) => setPassword(evt.target.value)}
        placeholder="Password"
        className="input input-bordered input-primary w-full max-w-xs font-semibold text-2xl"
       />
      </div>
     </fieldset>
     <div className="flex flex-col">
      <button className="btn btn-primary mb-5 text-xl" type="submit">
       Sign in
      </button>
      <button className="btn btn-outline text-xl">
       <Link to="/register">Not a member yet?</Link>
      </button>
     </div>
    </form>
   </section>
  </main>
 );
};

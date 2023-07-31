import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../auth/capstoneLogo.png"

export const Login = () => {
  const [providers, setProviders] = useState([]);
  const [patients, setPatients] = useState([]);
  const [email, set] = useState("Caleb@email.com");
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
        if (foundUsers.length === 1) {
          const user = foundUsers[0];
          localStorage.setItem(
            "capstone_user",
            JSON.stringify({
              id: user.id,
              isProvider: user.isProvider,
            })
          );
          if (doIHaveAProfile(user)) {
            if(user.isProvider){
              navigate("/ProviderHome")
            } else{
              navigate("/PatientHome")
            }
          } else {
            if (user.isProvider) {
              navigate("/ProviderProfile");
              window.alert("Please Complete new Profile Form");
            } else {
              navigate("/PatientProfile");
              setTimeout(() => {window.alert("Please Complete new Profile Form")},500);
            }
          }
        } else {
          window.alert("Invalid login");
        }
      });
  };

  return (
    <main className="flex flex-col w-screen h-screen align-center items-center bg-indigo-300 font-mono">
      <section className="">
        <h1 className=" font-extrabold text-5xl mt-20 text-center">
          Care<span className="text-6xl">X</span>pert
        </h1>
        <form
          className=" bg-white mt-32 border-2 border-slate-400 p-10 shadow-md shadow-black rounded-3xl"
          onSubmit={handleLogin}
        >
          <h1 className="mb-10 font-bold text-center text-3xl py-2 border-b">Login</h1>
          <fieldset className="mb-3">
            <div className="mb-3 flex justify-between text-xl">
              <label htmlFor="inputEmail">
                Email address:&nbsp;&nbsp;&nbsp;
              </label>
              <input
                type="email"
                value={email}
                onChange={(evt) => set(evt.target.value)}
                className=" py-px pl-px rounded-md"
                placeholder="Email address"
                required
                autoFocus
              />
            </div>
            <div className="mb-3 flex justify-end text-xl">
              <label htmlFor="inputPassword">Password: &nbsp;&nbsp;</label>
              <input
                type="password"
                placeholder="Password"
                className="rounded-md py-px pl-px"
              />
            </div>
          </fieldset>
            <div className="flex flex-col">
            <button className="hover:bg-green-200 text-Black bg-green-300 block text-center border-2 mb-5 text-xl py-1" type="submit">
              Sign in
            </button>
            <button className="hover:text-slate-300 block text-center border-2 text-xl py-1">
              <Link to="/register">Not a member yet?</Link>
            </button>
            </div>
        </form>
      </section>
    </main>
  );
};

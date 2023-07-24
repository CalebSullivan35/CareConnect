import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
            navigate("/");
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
    <main className="flex flex-col w-screen h-screen align-center items-center bg-slate-500">
      <section className="">
        <h1 className=" font-bold text-5xl mt-20 text-center">
          Health Connect
        </h1>
        <form
          className=" mt-32 border-2 border-slate-400 p-10 shadow-lg shadow-black rounded-3xl"
          onSubmit={handleLogin}
        >
          <h1 className="mb-10 font-bold text-center text-3xl">Welcome</h1>
          <h2 className="text-center mb-3 text-lg">Please sign in</h2>
          <fieldset className="mb-3">
            <div className="mb-3 flex justify-between">
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
            <div className="mb-3 flex justify-end">
              <label htmlFor="inputPassword">Password: &nbsp;&nbsp;</label>
              <input
                type="password"
                placeholder="Password"
                className="rounded-md py-px pl-px"
              />
            </div>
          </fieldset>
          <fieldset className="flex justify-evenly">
            <button className="hover:text-slate-300" type="submit">
              Sign in
            </button>
            <button className="hover:text-slate-300">
              <Link to="/register">Not a member yet?</Link>
            </button>
          </fieldset>
        </form>
      </section>
    </main>
  );
};

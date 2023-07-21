import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Login = () => {
 const [email, set] = useState("Caleb@email.com");
 const navigate = useNavigate();

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

     navigate("/");
    } else {
     window.alert("Invalid login");
    }
   });
 };

 return (
  <main className="flex flex-col w-screen h-screen align-center items-center bg-slate-500">
   <section>
    <form className="mt-40 " onSubmit={handleLogin}>
     <h1 className="mb-20 font-bold text-center text-3xl">Capstone Name</h1>
     <h2 className="text-center mb-3 text-lg">Please sign in</h2>
     <fieldset className="mb-3">
      <label htmlFor="inputEmail"> Email address </label>
      <input
       type="email"
       value={email}
       onChange={(evt) => set(evt.target.value)}
       className="form-control"
       placeholder="Email address"
       required
       autoFocus
      />
     </fieldset>
     <fieldset className="flex justify-evenly">
      <button className="hover:text-slate-300" type="submit">Sign in</button>
      <button className="hover:text-slate-300">
       <Link to="/register">Not a member yet?</Link>
      </button>
     </fieldset>
    </form>
   </section>
  </main>
 );
};

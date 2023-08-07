import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
 const [user, setUser] = useState({
  email: "",
  password: "",
  confirmPassword: "",
  isProvider: false,
 });
 let navigate = useNavigate();

 const registerNewUser = () => {
  return fetch("http://localhost:8088/users", {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify({
    email: user.email,
    password: user.password,
    isProvider: user.isProvider,
   }),
  })
   .then((res) => res.json())
   .then((createdUser) => {
    if (createdUser.hasOwnProperty("id")) {
     localStorage.setItem(
      "capstone_user",
      JSON.stringify({
       id: createdUser.id,
       staff: createdUser.isProvider,
      })
     );
     navigate("/Login");
    }
   });
 };

 const handleRegister = (e) => {
  e.preventDefault();
  return fetch(`http://localhost:8088/users?email=${user.email}`)
   .then((res) => res.json())
   .then((response) => {
    if (response.length > 0) {
     // Duplicate email. No good.
     window.alert("Account with that email address already exists");
    } else {
     // Good email, Check if passwords match.
     if (user.password === user.confirmPassword) {
      registerNewUser();
     } else {
      window.alert("Passwords Do Not Match");
     }
    }
   });
 };

 const updateUser = (evt) => {
  const copy = { ...user };
  copy[evt.target.id] = evt.target.value;
  setUser(copy);
 };

 return (
  <main className="text-center bg-base-200 w-screen h-screen">
   <form
    className="flex flex-col mt-20 justify-center align-middle items-center"
    onSubmit={handleRegister}
   >
    <h1 className=" font-mono font-bold h3 text-4xl mb-10 ">
     Please Register for CareConnect
    </h1>
    <div className="border-2 border-black p-10 flex flex-col justify-end rounded-2xl w-2/5">
     <h2 className="mb-5 text-3xl font-mono font-bold">
      Enter Profile Information
     </h2>
     <div className="flex justify-end flex-col">
      <fieldset className="flex mb-4 text-xl align-middle justify-center ">
       <label className="font-mono font-semibold" htmlFor="email">
        {" "}
        Email address:&nbsp;&nbsp;{" "}
       </label>
       <input
        onChange={updateUser}
        type="email"
        id="email"
        className="form-control"
        placeholder="Email address"
        required
       />
      </fieldset>
      <fieldset className="flex flex-row justify-center mb-4 text-xl">
       <label className="font-mono font-semibold" htmlFor="password">
        {" "}
        Password:&nbsp;&nbsp;{" "}
       </label>
       <input
        onChange={updateUser}
        type="password"
        id="password"
        className="form-control px-2 rounded-xl "
        placeholder="Password"
        required
       />
      </fieldset>
      <fieldset className="flex flex-row justify-center mb-4 text-xl">
       <label className="font-mono font-semibold" htmlFor="confirmPassword">
        {" "}
        Confirm Password:
       </label>
       <input
        onChange={updateUser}
        type="password"
        id="confirmPassword"
        className="form-control"
        placeholder="Confirm Password"
        required
       />
      </fieldset>
      <fieldset className="mb-4">
       <input
        className="font-mono text-xl font-semibold"
        onChange={(evt) => {
         const copy = { ...user };
         copy.isProvider = evt.target.checked;
         setUser(copy);
        }}
        type="checkbox"
        id="isProvider"
       />
       <label className="font-mono text-xl font-semibold" htmlFor="isProvider"> I am a healthcare Provider </label>
      </fieldset>
     </div>
     <fieldset className="flex justify-evenly">
      <button type="submit" className="font-mono text-3xl font-semibold border-2 border-black buttonEffect px-2 rounded-xl bg-primary"> Register </button>
      {/* <button onClick={navigate("/login")}>Cancel</button> */}
     </fieldset>
    </div>
   </form>
  </main>
 );
};

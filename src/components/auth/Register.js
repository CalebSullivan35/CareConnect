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
  <main className="text-center bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 font-mono w-screen h-screen">
   <form
    className="flex flex-col mt-20 justify-center align-middle items-center"
    onSubmit={handleRegister}
   >
    <h1 className=" font-extrabold text-6xl mt-20 text-center mb-20">
     Register for <span className="text-7xl italic">C</span>are
     <span className="text-7xl italic">C</span>
     onnect
    </h1>
    <div className="border-2  p-5 flex flex-col justify-end rounded-2xl bg-white ">
     <h2 className="mb-5 text-4xl font-mono font-bold border-b-2 pb-3 ">
      Enter Profile Information
     </h2>
     <div className="flex flex-col">
      <fieldset className="flex flex-col items-center mb-4 text-2xl">
       <label
        className="font-mono font-semibold text-2xl text-left flex justify-between w-3/5 m"
        htmlFor="email"
       >
        Email <i class="fa-solid fa-envelope"></i>
       </label>
       <input
        onChange={updateUser}
        type="email"
        id="email"
        className="input input-bordered input-primary w-3/5 max-w-xs font-semibold"
        placeholder="Email address"
        required
       />
      </fieldset>
      <fieldset className="flex flex-col items-center mb-4 text-2xl">
       <label
        className="font-mono font-semibold text-2xl text-left flex justify-between w-3/5"
        htmlFor="password"
       >
        Password <i class="fa-solid fa-lock"></i>
       </label>
       <input
        onChange={updateUser}
        type="password"
        id="password"
        className="input input-bordered input-primary w-3/5 max-w-xs font-semibold "
        placeholder="Password"
        required
       />
      </fieldset>
      <fieldset className="flex flex-col items-center mb-4 text-2xl">
       <label
        className="font-mono font-semibold text-2xl text-left  w-3/5 justify-between flex"
        htmlFor="confirmPassword"
       >
        Confirm Password <i class="fa-solid fa-lock"></i>
       </label>
       <input
        onChange={updateUser}
        type="password"
        id="confirmPassword"
        className="input input-bordered input-primary w-3/5 max-w-xs font-semibold"
        placeholder="Confirm Password"
        required
       />
      </fieldset>
      <fieldset className="my-5 align-middle">
       <input
        className="checkbox"
        onChange={(evt) => {
         const copy = { ...user };
         copy.isProvider = evt.target.checked;
         setUser(copy);
        }}
        type="checkbox"
        id="isProvider"
       />
       <label className="font-mono text-2xl font-semibold" htmlFor="isProvider">
        {" "}
        I am a healthcare Provider{" "}
       </label>
      </fieldset>
     </div>
     <fieldset className="flex justify-evenly">
      <button type="submit" className="btn btn-primary btn-wide">
       {" "}
       Register{" "}
      </button>
      {/* <button onClick={navigate("/login")}>Cancel</button> */}
     </fieldset>
    </div>
   </form>
  </main>
 );
};

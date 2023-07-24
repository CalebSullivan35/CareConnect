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
    <main className="text-center bg-slate-400 w-screen h-screen">
      <form
        className="flex flex-col mt-20 justify-center align-middle items-center"
        onSubmit={handleRegister}
      >
        <h1 className="h3 text-4xl mb-10">
          Please Register for Health Connect
        </h1>
        <div className="border-2 w-3/12 p-5 ">
            <h2 className="mb-5">Enter Profile Information</h2>
          <fieldset className="flex flex-row justify-end mb-4">
            <label htmlFor="email"> Email address:&nbsp;&nbsp; </label>
            <input
              onChange={updateUser}
              type="email"
              id="email"
              className="form-control"
              placeholder="Email address"
              required
            />
          </fieldset>
          <fieldset className="flex flex-row justify-end mb-4">
            <label htmlFor="password"> Password:&nbsp;&nbsp; </label>
            <input
              onChange={updateUser}
              type="password"
              id="password"
              className="form-control"
              placeholder="Password"
              required
            />
          </fieldset>
          <fieldset className="flex flex-row justify-end mb-4">
            <label htmlFor="confirmPassword"> Confirm Password:</label>
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
              onChange={(evt) => {
                const copy = { ...user };
                copy.isProvider = evt.target.checked;
                setUser(copy);
              }}
              type="checkbox"
              id="isProvider"
            />
            <label htmlFor="isProvider"> I am a healthcare Provider </label>
          </fieldset>
          <fieldset className="flex justify-evenly">
            <button type="submit"> Register </button>
            {/* <button onClick={navigate("/login")}>Cancel</button> */}
          </fieldset>
        </div>
      </form>
    </main>
  );
};

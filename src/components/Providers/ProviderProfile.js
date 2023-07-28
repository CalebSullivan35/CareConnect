import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ProviderProfile = () => {
  const navigate = useNavigate();
  const [showPopUp, setShowPopUp] = useState(false);
  const [currentProvider, setCurrentProvider] = useState(false);
  const localCapstoneUser = localStorage.getItem("capstone_user");
  const capstoneUserObject = JSON.parse(localCapstoneUser);
  const [providerProfileInformation, setProviderProfileInformation] = useState({
    id: 0,
    userId: capstoneUserObject.id,
    address: "",
    height: 0,
    weight: 0,
  });

  useEffect(() => {
    fetch(
      `http://localhost:8088/Providers?_expand=user&userId=${capstoneUserObject.id}`
    )
      .then((response) => response.json())
      .then((data) => {
        // checks if there is already a matching provider based on the capstone user object id
        // if there isnt one then do nothing.
        if (data[0]) {
          setCurrentProvider(true);
          console.log(data);
          setProviderProfileInformation({
            id: data[0].id,
            fullName: data[0].fullName,
            userId: capstoneUserObject.id,
            specialty: data[0]?.specialty,
            education: data[0]?.education,
            
          });
        }
      });
  }, []);

  const handleSubmitButton = (event) => {
    event.preventDefault();

    if (currentProvider === false) {
      const providerProfileInfoToSendToApiAsPost = {
        userId: capstoneUserObject.id,
        fullName: providerProfileInformation.fullName,
        specialty: providerProfileInformation.specialty,
        education: providerProfileInformation.education,
      };
      // Fetch to Post The object to the API
      return fetch("http://localhost:8088/Providers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(providerProfileInfoToSendToApiAsPost),
      })
        .then((response) => response.json())
        .then(() => {
          navigate("http://localhost:3000/");
        });
    } else {
      const providerProfileInfoToSendToApiAsPut = {
        userId: capstoneUserObject.id,
        fullName: providerProfileInformation.fullName,
        address: providerProfileInformation.address,
        specialty: providerProfileInformation.specialty,
        education: providerProfileInformation.education,
      };
      return fetch(
        `http://localhost:8088/Providers/${providerProfileInformation.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(providerProfileInfoToSendToApiAsPut),
        }
      )
        .then((response) => response.json())
        .then(() => {
          navigate("http://localhost:3000/");
        });
    }
  };

  return (
    <div className="flex flex-col w-screen bg-slate-200 h-screen items-center">
      <h1 className="mt-10 text-4xl font-mono underline">Profile Information</h1>
      <div className="flex flex-col items-center mt-10 p-5 border bg-white w-3/12">
        <fieldset>
          <div className="mb-2 w-12/12 text-2xl flex flex-row justify-between">
            <label className="pt-2">Full Name: </label>
            <input
              className="p-2"
              required
              type="text"
              placeholder="Full name"
              value={providerProfileInformation.fullName}
              onChange={(event) => {
                setProviderProfileInformation((prevProfile) => ({
                  ...prevProfile,
                  fullName: event.target.value,
                }));
              }}
            />
          </div>
          <div className="mb-2 w-50 text-2xl flex flex-row justify-between">
            <label className="pt-2">Specialty: </label>
            <input
              required
              className="p-2"
              type="text"
              placeholder=""
              value={providerProfileInformation.specialty}
              onChange={(event) => {
                setProviderProfileInformation((prevProfile) => ({
                  ...prevProfile,
                  specialty: event.target.value,
                }));
              }}
            />
          </div>
          <div className="mb-2 w-50 text-2xl flex flex-row justify-between">
            <label className="pt-2">Education: </label>
            <input
              required
              className="p-2"
              type="text"
              placeholder=""
              value={providerProfileInformation.education}
              onChange={(event) => {
                setProviderProfileInformation((prevProfile) => ({
                  ...prevProfile,
                  education: event.target.value,
                }));
              }}
            />
          </div>
        </fieldset>
        <button
          className="text-2xl buttonEffect border-2 px-2 py-1 rounded-xl"
          onClick={(event) => {
            handleSubmitButton(event);
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ProviderProfile = () => {
  const navigate = useNavigate();
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
    <div className="flex flex-col w-screen justify-center align-middle items-center mt-20">
      <div className="flex flex-col items-center">
        <fieldset>
          <div className="mb-2 w-50">
            <label>Full Name: </label>
            <input
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
          <div className="mb-2 w-50">
            <label>Specialty: </label>
            <input
              required
              className="w-20 w-50"
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
          <div className="mb-2">
            <label>Education: </label>
            <input
              required
              className="w-20"
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
          className="w-20"
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

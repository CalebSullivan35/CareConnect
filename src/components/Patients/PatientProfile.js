import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const PatientProfile = () => {
  const navigate = useNavigate();

  const [currentPatient, setCurrentPatient] = useState(false);
  const localCapstoneUser = localStorage.getItem("capstone_user");
  const capstoneUserObject = JSON.parse(localCapstoneUser);
  const [patientProfileInformation, setPatientProfileInformation] = useState({
    id: 0,
    userId: capstoneUserObject.id,
    address: "",
    height: 0,
    weight: 0,
    profileImage: ""
  });

  useEffect(() => {
    fetch(
      `http://localhost:8088/patients?_expand=user&userId=${capstoneUserObject.id}`
    )
      .then((response) => response.json())
      .then((data) => {
        // checks if there is already a matching patient based on the capstone user object id
        // if there isnt one then do nothing.
        if (data[0]) {
          setCurrentPatient(true);
          console.log(data);
          setPatientProfileInformation({
            id: data[0].id,
            fullName: data[0].fullName,
            userId: capstoneUserObject.id,
            address: data[0]?.address,
            height: data[0]?.height,
            weight: data[0]?.weight,
            profileImage: data[0]?.profileImage
          });
        }
      });
  }, []);

  const handleSubmitButton = (event) => {
    event.preventDefault();

    if (currentPatient === false) {
      const patientProfileInfoToSendToApiAsPost = {
        userId: capstoneUserObject.id,
        fullName: patientProfileInformation.fullName,
        address: patientProfileInformation.address,
        height: parseInt(patientProfileInformation.height),
        weight: parseInt(patientProfileInformation.weight),
        profileImage : patientProfileInformation.profileImage
      };
      // Fetch to Post The object to the API
      return fetch("http://localhost:8088/Patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientProfileInfoToSendToApiAsPost),
      })
        .then((response) => response.json())
        .then(() => {
          navigate("/PatientHome");
        });
    } else {
      const patientProfileInfoToSendToApiAsPut = {
        userId: capstoneUserObject.id,
        fullName: patientProfileInformation.fullName,
        address: patientProfileInformation.address,
        height: parseInt(patientProfileInformation.height),
        weight: parseInt(patientProfileInformation.weight),
        profileImage : patientProfileInformation.profileImage
      };
      return fetch(
        `http://localhost:8088/Patients/${patientProfileInformation.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patientProfileInfoToSendToApiAsPut),
        }
      )
        .then((response) => response.json())
        .then(() => {
          navigate("/PatientHome");
        });
    }
  };

  return (
    <div className="flex flex-col items-center  bg-base-200 w-screen h-screen">
      <h1 className="font-mono text-4xl mb-12 mt-32">
        Personal Profile Information
      </h1>
      <div className="flex flex-col items-center w-5/12 border-2 border-black bg-white rounded-2xl py-10">
        <fieldset className="pl-5">
          <div className="mb-5 w-50">
            <label className="font-mono text-2xl">Full Name: </label>
            <input
              className="font-mono text-2xl"
              required
              type="text"
              placeholder="Full name"
              value={patientProfileInformation.fullName}
              onChange={(event) => {
                setPatientProfileInformation((prevProfile) => ({
                  ...prevProfile,
                  fullName: event.target.value,
                }));
              }}
            />
          </div>
          <div className="mb-5 w-50">
            <label className="font-mono text-2xl">Profile Image: </label>
            <input
              className="font-mono text-2xl"
              required
              type="text"
              placeholder="Profile Image"
              value={patientProfileInformation.profileImage}
              onChange={(event) => {
                setPatientProfileInformation((prevProfile) => ({
                  ...prevProfile,
                  profileImage: event.target.value,
                }));
              }}
            />
          </div>
          <div className="mb-5 w-50">
            <label className="font-mono text-2xl">Current Address: </label>
            <input
              className="font-mono text-2xl"
              required
              type="text"
              placeholder="Address"
              value={patientProfileInformation.address}
              onChange={(event) => {
                setPatientProfileInformation((prevProfile) => ({
                  ...prevProfile,
                  address: event.target.value,
                }));
              }}
            />
          </div>
          <div className="mb-5 w-50">
            <label className="font-mono text-2xl">Current Height: </label>
            <input
              required
              className="w-20 w-50 font-mono text-2xl"
              type="number"
              placeholder="Height"
              value={patientProfileInformation.height}
              onChange={(event) => {
                setPatientProfileInformation((prevProfile) => ({
                  ...prevProfile,
                  height: event.target.value,
                }));
              }}
            />
            <span className="font-mono text-2xl"> Inches</span>
          </div>
          <div className="mb-5">
            <label className="font-mono text-2xl">Current Weight: </label>
            <input
              required
              className="w-20 font-mono text-2xl"
              type="number"
              max="400"
              placeholder="Weight"
              value={patientProfileInformation.weight}
              onChange={(event) => {
                setPatientProfileInformation((prevProfile) => ({
                  ...prevProfile,
                  weight: event.target.value,
                }));
              }}
            /><span className="font-mono text-2xl"> Pounds</span>
          </div>
        </fieldset>
        <button
          className="btn btn-primary"
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

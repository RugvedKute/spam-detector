import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "../components/InputField";
import { Constants } from "../config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Loader from "../components/Loader";

export default function Signup({ onLogin }) {
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNo: "",
    country: "",
    city: "",
  });
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setSignUpData({
      ...signUpData,
      [field]: value,
    });
  };

  const submitForm = () => {
    if (
      !signUpData.name ||
      !signUpData.email ||
      !signUpData.password ||
      !signUpData.phoneNo
    ) {
      toast.error("Fill all the details", {
        position: "top-right",
      });
      return;
    }

    setLoading(true); // Set loading to true when request is initiated

    axios
      .post(Constants.API_URL + "/user/signup", signUpData)
      .then((response) => {
        if (response.data.statusCode === 409) {
          toast.error("User already exists!");
        } else if (response.data.statusCode === 200) {
          onLogin();
          toast.success("Email Sent. Verify your email!", {
            position: "top-right",
          });
          localStorage.setItem("token", response.data.message);
          navigate("/signup/otp");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Cannot send mail. Please try again later!", {
          position: "top-right",
        });
      })
      .finally(() => {
        setLoading(false); // Set loading to false when request is completed
      });
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="border-2 shadow-sm rounded-sm p-5 min-w-[300px]">
        <h1 className="text-center text-2xl font-bold">Create an account</h1>
        <p className="mt-1 text-center text-sm text-slate-400">
          Enter your account details
        </p>
        <div className="mt-2 flex flex-col gap-2">
          <InputField
            labelName={"Name"}
            type={"text"}
            placeholder={"Enter your name"}
            field={"name"}
            value={signUpData.name}
            setData={handleInputChange}
            required={true}
          />

          <InputField
            labelName={"Email Address"}
            type={"email"}
            placeholder={"Enter your email address"}
            field={"email"}
            value={signUpData.email}
            setData={handleInputChange}
            required={true}
          />
          <InputField
            labelName={"Phone No"}
            type={"text"}
            placeholder={"Enter your phone number"}
            field={"phoneNo"}
            value={signUpData.phoneNo}
            setData={handleInputChange}
            required={true}
          />
          <InputField
            labelName={"Password"}
            type={"password"}
            placeholder={"Enter your password"}
            field={"password"}
            value={signUpData.password}
            setData={handleInputChange}
            required={true}
          />
          <InputField
            labelName={"Country"}
            type={"text"}
            placeholder={"Enter your Country"}
            field={"country"}
            value={signUpData.country}
            setData={handleInputChange}
          />
          <InputField
            labelName={"City"}
            type={"text"}
            placeholder={"Enter your City"}
            field={"city"}
            value={signUpData.city}
            setData={handleInputChange}
          />
        </div>
        <p className="text-sm text-center mt-2 text-slate-400">
          Already have an account?
          <Link to={"/signin"}>
            <span className="ml-1 text-black hover:underline">Sign In</span>
          </Link>
        </p>
        <button
          type="button"
          className="mt-3 w-full bg-black text-white px-1 py-1.5 rounded-md text-sm"
          onClick={submitForm}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader></Loader>
            </span>
          ) : (
            "Sign Up"
          )}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

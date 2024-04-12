import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InputField from "../components/InputField";
import Loader from "../components/Loader";
import { Constants } from "../config";

export default function Signin({ onLogin }) {
  const [signUpData, setSignUpData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setSignUpData({ ...signUpData, [field]: value });
  };

  const submitForm = () => {
    setLoading(true);
    axios
      .post(Constants.API_URL + "/user/signin", signUpData)
      .then((response) => {
        if (response.data.statusCode === 401) {
          toast.error("Invalid Email or Password");
        }
        if (response.data.statusCode === 200) {
          onLogin();
          localStorage.setItem("token", response.data.data);
          toast.success("Login SucessFully done");
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("can not sign in! please try again later");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="border-2 shadow-sm rounded-sm p-5 min-w-[300px]">
        <h1 className="text-center text-2xl font-bold">Login In</h1>
        <p className="mt-1 text-center text-sm text-slate-400">
          Login into your account
        </p>
        <div className="mt-2 flex flex-col gap-2">
          <InputField
            labelName={"Email"}
            type={"text"}
            placeholder={"Enter your email"}
            value={signUpData.email}
            field={"email"}
            setData={handleInputChange}
          ></InputField>
          <InputField
            labelName={"Password"}
            type={"password"}
            placeholder={"Enter your password"}
            field={"password"}
            setData={handleInputChange}
          ></InputField>
        </div>

        <p className="text-sm text-center mt-2 text-slate-400">
          Dont have an account?
          <Link to={"/signup"}>
            <span className="ml-1 text-black hover:underline">Sign up</span>
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
            "Sign In"
          )}
        </button>
      </div>
    </div>
  );
}

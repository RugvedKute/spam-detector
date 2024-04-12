import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Constants } from "../config";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../components/Loader";

export default function Verifyotp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // State for loading

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true); // Set loading to true when request is initiated

    const token = localStorage.getItem("token");
    axios
      .post(
        Constants.API_URL + "/user/verify-otp",
        {
          otp: otp,
        },
        {
          headers: {
            Authorization: "token " + token,
          },
        }
      )
      .then((response) => {
        if (response.data.statusCode === 403) {
          toast.error("Wrong Otp !");
        } else if (response.data.statusCode === 200) {
          toast.success("Verified your account successfully ", {
            position: "top-right",
          });

          navigate("/signin");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Cannot verify otp. Please try again later!", {
          position: "top-right",
        });
      })
      .finally(() => {
        setLoading(false); // Set loading to false when request is completed
      });
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="border-2 shadow-sm rounded-sm p-5 min-w-[250px]">
        <h1 className="text-center text-2xl font-bold">Verify OTP</h1>
        <p className="mt-1 text-center text-slate-400 text-sm">
          Enter otp send to your email
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full h-10 mt-4 bg-white border border-gray-300 rounded-md outline-none text-2xl font-semibold text-center"
            maxLength={4}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            type="submit"
            className="w-full mt-4 bg-black text-white px-1 py-1.5 rounded-md text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader></Loader>
              </span>
            ) : (
              "Verify Otp"
            )}
          </button>
        </form>

        <button className="w-full border-2 border-slate-200 bg-transparent text-black px-1 py-1.5 mt-2 rounded-md text-sm">
          Resend OTP
        </button>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}

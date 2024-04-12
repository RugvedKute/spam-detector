import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import axios from "axios";
import { Constants } from "../config.js";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../components/Loader.jsx";

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [spamScore, setSpamScore] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    axios
      .post(
        Constants.API_URL + "/user/get-score",
        {
          phoneNo: phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ` + localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.statusCode == 404) {
          toast.error("No User Found");
        }

        if (response.data.statusCode == 200) {
          toast.success(`Score for ${response.data.data.name} fetched`);
          setSpamScore(response.data.data.spamScore);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <Navbar></Navbar>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-30 mt-10 sm:mt-0 ">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl/none">
                  Check the Spam Percentage
                </h1>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Enter a phone number to check its spam percentage.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <input
                    className="max-w-lg flex-1 border-2 border-slate-200 p-2 rounded-md"
                    placeholder="Enter phone number"
                    type="text"
                    maxLength={10}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                    }}
                  />
                  <button
                    className="bg-black text-white py-1.5 px-2 rounded-md"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <Loader></Loader>
                      </span>
                    ) : (
                      "Check"
                    )}
                  </button>
                </form>
                {phoneNumber && spamScore ? (
                  <div>
                    <p className="mt-4 text-center text-xl font-bold text-gray-500">
                      Spam Score: {spamScore}
                    </p>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-30 border-t">
          <div className="container grid items-center gap-4 px-4 md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                What is the Spam Percentage?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                The spam percentage indicates the likelihood that a phone number
                is associated with spam calls. A higher percentage means a
                higher likelihood of spam.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer></Footer>
      <ToastContainer></ToastContainer>
    </div>
  );
}

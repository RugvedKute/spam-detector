import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import InputField from "../components/InputField";
import axios from "axios";
import { Constants } from "../config";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

export default function Createcontact() {
  const navigate = useNavigate();
  const [createContactData, setcreateContactData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setcreateContactData({ ...createContactData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !createContactData.firstName ||
      !createContactData.lastName ||
      !createContactData.phoneNo ||
      !createContactData.email
    ) {
      toast.error("Please fill all the details");
    }

    axios
      .post(Constants.API_URL + "/contacts/create-contact", createContactData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.statusCode === 400) {
          toast.error(response.data.message);
        }

        if (response.data.statusCode === 200) {
          setLoading(true);
          setTimeout(() => {
            toast.success("Contact created successfully!");
          }, 3000);
          navigate("/contact");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error creating contact");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="h-screen">
      <Navbar></Navbar>
      <main className="flex-1 overflow-y-auto pb-8 pt-10 h-[90vh]">
        <section className="grid gap-6 px-4 py-6 text-sm md:gap-8 sm:px-6 md:py-12 lg:py-16">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Create a new contact</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter the phone number to check the spam percentage.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                labelName={"First Name"}
                type={"text"}
                placeholder={"Enter your first name"}
                field={"firstName"}
                setData={handleChange}
              ></InputField>
              <InputField
                labelName={"Last Name"}
                type={"text"}
                placeholder={"Enter your last name"}
                field={"lastName"}
                setData={handleChange}
              ></InputField>
            </div>
            <InputField
              labelName={"Phone Number"}
              type={"text"}
              placeholder={"Enter the phone number"}
              field={"phoneNo"}
              setData={handleChange}
            ></InputField>
            <InputField
              labelName={"Email"}
              type={"email"}
              placeholder={"Enter your email"}
              field={"email"}
              setData={handleChange}
            ></InputField>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-1.5 rounded-md"
              onClick={handleSubmit}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader></Loader>
                </span>
              ) : (
                "Save Contact"
              )}
            </button>
          </div>
        </section>
      </main>
      <Footer></Footer>
      <ToastContainer></ToastContainer>
    </div>
  );
}

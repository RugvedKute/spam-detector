import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Constants } from "../config";
import Avatar from "./Avatar";

export default function ContactCard({ firstName, lastName, id, spam, email }) {
  const [value, setValue] = useState(spam);
  const markSpam = async () => {
    axios
      .post(
        Constants.API_URL + "/contacts/mark-spam",
        {
          id: id.toString(),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        if (response.data.success === true) {
          setValue(true);
          toast.success("Contact marked as spam");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error marking contact as spam");
      });
  };

  return (
    <div className="w-full flex justify-between items-center p-5 border-2 border-slate-200 rounded-md flex-wrap">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 bg-gray-200 rounded-full`}></div>
        <div>
          <h1 className="font-semibold text-lg">
            {firstName} {lastName}
          </h1>
          <span>{email}</span>
        </div>
      </div>
      <div className="mt-2.5 flex gap-3 sm:mt-0">
        <button
          type="submit"
          className="bg-red-500 text-white px-2 py-1.5 rounded-md"
          onClick={markSpam}
          disabled={spam}
        >
          {spam || value == true ? "Marked as spam" : "Mark spam"}
        </button>
        <Link to={`/contact/${id}`}>
          <button className="border-2 border-slate-200  text-black px-2 py-1.5 rounded-md">
            View
          </button>
        </Link>
      </div>
    </div>
  );
}

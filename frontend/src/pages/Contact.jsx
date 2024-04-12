import React from "react";
import { useParams } from "react-router-dom";

import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import { useSingleContact } from "../hooks/index.js";

export default function Contact({
  firstName,
  phoneNumber,
  lastName,
  spamPercent,
}) {
  const { id } = useParams();
  const { loading, singleContact } = useSingleContact(id);

  return (
    <div>
      <Navbar></Navbar>
      <main className="flex-1 overflow-y-auto pb-8 pt-10 h-[90vh]">
        <section className="px-4 py-6 text-sm   md:gap-8  sm:px-6 md:py-12  lg:py-16">
          <h1 className="text-3xl font-bold text-center sm:mt-5t">Contact</h1>
          {loading ? (
            <div className="mt-5">
              <Skeleton></Skeleton>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-10 flex-wrap justify-center text-center sm:mt-2">
              <div className={`w-24 h-24 bg-gray-200 rounded-full`}></div>
              <div>
                <h1 className="text-xl font-medium mt-2">
                  {" "}
                  Name: {singleContact.firstName} {singleContact.lastName}
                </h1>
                <h1 className="text-xl font-medium mt-2">
                  Email: {singleContact.email}
                </h1>
                <h1 className="text-xl font-medium mt-2 ">
                  Phone No: {singleContact.phoneNo}
                </h1>
                <h1 className="text-xl font-medium mt-2">
                  Spam Percentage:{" "}
                  {singleContact.spamScore ? singleContact.spamScore : 0}%
                </h1>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer></Footer>
    </div>
  );
}

function Skeleton() {
  return (
    <div
      role="status"
      className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
    >
      <div className="flex items-center justify-center w-40 h-40 bg-gray-300 rounded-full sm:w-40 ">
        <svg
          className="w-10 h-10 text-gray-200 "
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="currentColor"
          viewBox="0 0 20 18"
        >
          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
        </svg>
      </div>
      <div className="w-full">
        <div className="h-2.5 bg-gray-200 rounded-full  w-48 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded-full max-w-[480px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full  mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full  max-w-[440px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full  max-w-[460px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full  max-w-[360px]"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

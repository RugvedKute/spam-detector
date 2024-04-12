import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const signOut = () => {
    localStorage.removeItem("token");
    navigate("/signin", { replace: true });
  };

  return (
    <div className="w-full bg-white flex flex-col fixed top-0">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b-2 border-slate-200">
        <nav className="flex justify-between items-center w-full">
          <div>
            <Link className="flex items-center justify-center" to={"/"}>
              <MountainIcon className="h-6 w-6" />
              <span className="text-xl font-semibold ml-2">Spam Detector</span>
            </Link>
          </div>
          <div className="block sm:hidden" onClick={() => setOpen(!open)}>
            <MenuIcon />
          </div>
          {open && (
            <div className="sm:hidden absolute top-full w-full right-0 flex flex-col items-center  bg-white border border-gray-200 rounded shadow-lg z-10">
              <Link
                to={"/"}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Home
              </Link>
              <Link
                to={"/contact"}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Contacts
              </Link>
              <button
                className="block px-4 py-2 text-red-600 hover:bg-gray-100 "
                onClick={signOut}
              >
                Sign Out
              </button>
            </div>
          )}
          <div className="hidden gap-4 items-center sm:flex">
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              to={"/"}
            >
              Home
            </Link>
            <Link
              to={"/contact"}
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Contacts
            </Link>

            <button
              className="text-sm font-medium bg-red-500 text-white px-1.5 py-2 rounded-md"
              type="sumbit"
              onClick={signOut}
            >
              Sign Out
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
}

function MountainIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
      />
    </svg>
  );
}

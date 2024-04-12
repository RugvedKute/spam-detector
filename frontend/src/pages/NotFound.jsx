import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl">404 - Page Not Found</h1>
      <p>Go back to home page</p>
      <Link to={"/"}>
        <button className="bg-blue-500 p-2 text-white cursor-pointer rounded-md">
          Home
        </button>
      </Link>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import ContactCard from "../components/ContactCard";
import { useContacts } from "../hooks";
import Loader from "../components/Loader";

export default function Contacts() {
  const { loading, contacts } = useContacts();
  const [searchResults, setSearchResults] = useState();

  function debounce(func, timeout = 1000) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  useEffect(() => {
    setSearchResults(contacts);
  }, [contacts]);

  const searchContacts = debounce((query) => {
    const startWithContacts = contacts.filter((contact) => {
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
      return fullName.startsWith(query.toLowerCase());
    });

    const containsInAnyField = contacts.filter((contact) => {
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
      return (
        !fullName.startsWith(query.toLowerCase()) &&
        fullName.toLowerCase().includes(query.toLowerCase())
      );
    });

    const startsWithNumber = contacts.filter((contact) => {
      return contact.phoneNo.includes(query);
    });

    const filteredContacts = [
      ...startWithContacts,
      ...containsInAnyField,
      ...startsWithNumber,
    ];
    setSearchResults(filteredContacts);
  });

  return (
    <div>
      <Navbar></Navbar>
      <main className="flex-1 overflow-y-auto pb-8 pt-10 h-[90vh]">
        <section className="px-4 py-6 text-sm md:gap-8 sm:px-6 md:py-12 lg:py-16 h-full">
          <div className="flex flex-col items-center justify-between  sm:flex-row">
            <h1 className="text-3xl font-bold">Contacts</h1>
            <div className="mt-4 flex gap-4 sm:mt-0">
              <div className="flex items-center justify-between border-2 border-slate-200 px-1 rounded-md">
                <SearchIcon></SearchIcon>
                <input
                  type="search"
                  placeholder="Search"
                  className="px-1 py-1/2 focus:outline-none sm:px-2 py-1"
                  onChange={(e) => {
                    searchContacts(e.target.value);
                  }}
                ></input>
              </div>
              <Link to={"/create-contact"}>
                <button className="border-2 py-2 px-1.5 font-medium rounded-md">
                  New Contact
                </button>
              </Link>
            </div>
          </div>
          <div className="pt-5">
            {loading ? (
              <div className="mt-20 flex items-center justify-center">
                <Loader></Loader>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {searchResults.length === 0 ? (
                  <div className="mt-20 text-2xl font-semibold text-center">
                    No contacts found.
                  </div>
                ) : (
                  searchResults.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      id={contact.id}
                      firstName={contact.firstName}
                      lastName={contact.lastName}
                      spam={contact.spam}
                      email={contact.email}
                    ></ContactCard>
                  ))
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer></Footer>
    </div>
  );
}

function SearchIcon() {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

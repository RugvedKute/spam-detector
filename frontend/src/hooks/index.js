import { useEffect, useState } from "react";
import axios from "axios";
import { Constants } from "../config.js";

export const useContacts = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";

    axios
      .get(Constants.API_URL + "/contacts/get-contacts", {
        headers: { Authorization: "token " + token },
      })
      .then((response) => {
        setContacts(response.data.data);
        setLoading(false);
      });
  }, []);

  return {
    loading,
    contacts,
  };
};

export const useSingleContact = (id) => {
  const [singleContact, setSingleContact] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${Constants.API_URL}/contacts/singleContact/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setSingleContact(res.data.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return { singleContact, loading };
};

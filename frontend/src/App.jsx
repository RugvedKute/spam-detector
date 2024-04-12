import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Contact from "./pages/Contact";
import Contacts from "./pages/Contacts";
import Createcontact from "./pages/Createcontact";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Verifyotp from "./pages/Verifyotp";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
      <BrowserRouter>
        {!isAuthenticated ? (
          <Routes>
            <Route
              path={"/signin"}
              element={<Signin onLogin={handleLogin} />}
            ></Route>
            <Route
              path="/signup"
              element={<Signup onLogin={handleLogin} />}
            ></Route>
            <Route path="/*" element={<Signin />}></Route>
          </Routes>
        ) : (
          <Routes>
            <Route path={"/signin"} element={<Signin />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/signup/otp" element={<Verifyotp />}></Route>
            <Route path="/" element={<Home />}></Route>
            <Route path="/create-contact" element={<Createcontact />}></Route>
            <Route path="/contact" element={<Contacts />}></Route>
            <Route path="/contact/:id" element={<Contact />}></Route>
            <Route path="/*" element={<NotFound />}>
              404
            </Route>
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;

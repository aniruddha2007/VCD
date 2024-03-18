import React from "react";
import { Route, Routes } from "react-router-dom";

// Import the components
import Navbar from "./components/navbar.js";
import UserList from "./components/user_list.js";
import OfferList from "./components/offer_list.js";
import Home from "./components/home.js";


const App = () => {
    return (
        <div>
        <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/offers" element={<OfferList />} />
        </Routes>
        </div>
    );
    };

export default App;
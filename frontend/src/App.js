import React from "react";
import { Route, Routes } from "react-router-dom";

// Import the components
import Navbar from "./components/navbar.js";
import UserList from "./components/user_list.js";
import OfferList from "./components/offer_list.js";
import InquireList from "./components/inquire_list.js";
import Home from "./components/home.js";
import ServerActivity from "./components/server_activity.js";
import SelectedOffer from "./components/selected_offer.js";
import EditOfferModal from "./components/offer_edit_modal.js";
import CreateNewUser from "./components/User/create_user.js";
// eslint-disable-next-line
import Test from "./components/test.js";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/offers" element={<OfferList />} />
        <Route path="/inquires" element={<InquireList />} />
        <Route path="/edit_offer" element={<EditOfferModal />} />
        <Route path="/server_activity" element={<ServerActivity />} />
        <Route path="/selected offers" element={<SelectedOffer />} />
        <Route path="/create_new_user" element={<CreateNewUser />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </div>
  );
};

export default App;

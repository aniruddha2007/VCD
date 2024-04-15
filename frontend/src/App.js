import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./components/home";
// import Login from "./components/Authentication/login";
// import Register from "./components/Authentication/register";
// import { AuthProvider } from "./components/Authentication/AuthContext";
import UserList from "./components/User/user_list";
import OfferList from "./components/Offer/offer_list";
import InquireList from "./components/Inquiry/inquire_list";
import ServerActivity from "./components/server_activity";
import SelectedOffer from "./components/selected_offer";
import EditOfferModal from "./components/Offer/offer_edit_modal";
import CreateNewUser from "./components/User/create_user";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />{" "}
        {/* UsePrivateRoute instead of Route */}
        <Route path="/users" element={<UserList />} />{" "}
        {/* UsePrivateRoute instead of Route */}
        <Route path="/offers" element={<OfferList />} />{" "}
        {/* UsePrivateRoute instead of Route */}
        <Route path="/inquires" element={<InquireList />} />{" "}
        {/* UsePrivateRoute instead of Route */}
        <Route path="/edit-offer" element={<EditOfferModal />} />{" "}
        {/* UsePrivateRoute instead of Route */}
        <Route path="/server-activity" element={<ServerActivity />} />{" "}
        {/* Use PrivateRoute instead of Route */}
        <Route path="/selected-offers" element={<SelectedOffer />} />{" "}
        {/* Use PrivateRoute instead of Route */}
        <Route path="/create-new-user" element={<CreateNewUser />} />{" "}
        {/* Use PrivateRoute instead of Route */}
      </Routes>
    </div>
  );
};

export default App;

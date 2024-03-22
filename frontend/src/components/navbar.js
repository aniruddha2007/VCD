import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            {/* eslint-disable-next-line */}
            <img
              style={{ width: 125 + "%" }}
              src="https://www.virtuit.com.tw/media/logo.png"
              alt="Logo"
            ></img>
          </NavLink>
          <div
            className="navbar-collapse justify-content-end collapse"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/offers">
                  Offer
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/users">
                  User
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/inquires">
                  Inquires
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/server_activity">
                  Server Activity
                </NavLink>
              </li>
              {/* Add more links here */}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

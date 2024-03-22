import React, { useState, useEffect } from "react";
import axios from "axios";

const ServerActivity = () => {
  const [flaskStatus, setFlaskStatus] = useState(null);
  const [expressStatus, setExpressStatus] = useState(null);
  const [mongodbStatus, setMongoDBStatus] = useState(null);

  useEffect(() => {
    // Fetch Flask server status
    const fetchFlaskStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/health/flask",
        );
        setFlaskStatus(
          response.data.message === "Flask server is healthy"
            ? "running"
            : "error",
        );
      } catch (error) {
        console.error("Error fetching Flask server status:", error);
        setFlaskStatus("error");
      }
    };

    // Fetch Express server status
    const fetchExpressStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/health/express",
        );
        setExpressStatus(
          response.data.message === "Express server is healthy"
            ? "running"
            : "error",
        );
      } catch (error) {
        console.error("Error fetching Express server status:", error);
        setExpressStatus("error");
      }
    };

    // Fetch MongoDB status
    const fetchMongoDBStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/health/mongodb",
        );
        setMongoDBStatus(
          response.data.message === "MongoDB connection is open"
            ? "open"
            : "error",
        );
      } catch (error) {
        console.error("Error fetching MongoDB status:", error);
        setMongoDBStatus("error");
      }
    };

    // Call the fetch functions
    fetchFlaskStatus();
    fetchExpressStatus();
    fetchMongoDBStatus();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Server Activity</h1>
      <div className="row">
        <div className="col-md-4">
          <div
            className={`card ${flaskStatus === "running" ? "bg-success" : "bg-danger"} mb-4`}
          >
            <div className="card-body">
              <h5 className="card-title">Line And Whatsapps Services</h5>
              <p className="card-text">Status: {flaskStatus}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className={`card ${expressStatus === "running" ? "bg-success" : "bg-danger"} mb-4`}
          >
            <div className="card-body">
              <h5 className="card-title">API Services</h5>
              <p className="card-text">Status: {expressStatus}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className={`card ${mongodbStatus === "open" ? "bg-success" : "bg-danger"} mb-4`}
          >
            <div className="card-body">
              <h5 className="card-title">Database Services</h5>
              <p className="card-text">Status: {mongodbStatus}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerActivity;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import ServerActivity from "./server_activity.js";

const Home = () => {
  const [entries, setEntries] = useState([]);
  // eslint-disable-next-line
  const [inquire, setInquire] = useState([]);
  const [todayOffers, setTodayOffers] = useState([]);
  const [todayInquires, setTodayInquires] = useState([]);
  // eslint-disable-next-line
  const [selectedOffers, setSelectedOffers] = useState([]);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const apiKey = "aniruddhaqwerty1234"; // Replace with your actual API key

        // Fetch data for Offers
        const offersResponse = await fetch(
          "http://localhost:3000/offer_db/offers/read",
          {
            headers: {
              "x-api-key": apiKey,
            },
          },
        );

        if (!offersResponse.ok) {
          throw new Error(
            `An error occurred while fetching offers: ${offersResponse.statusText}`,
          );
        }

        const offersData = await offersResponse.json();

        // Fetch data for Today Offers
        const todayOffersResponse = await fetch(
          "http://localhost:3000/offer_db/today_offer/read",
          {
            headers: {
              "x-api-key": apiKey,
            },
          },
        );

        if (!todayOffersResponse.ok) {
          throw new Error(
            `An error occurred while fetching today's offers: ${todayOffersResponse.statusText}`,
          );
        }

        const todayOffersData = await todayOffersResponse.json();

        // Fetch data for Today Inquires
        const todayInquiresResponse = await fetch(
          "http://localhost:3000/inquire_db/today_inquires/read",
          {
            headers: {
              "x-api-key": apiKey,
            },
          },
        );

        if (!todayInquiresResponse.ok) {
          throw new Error(
            `An error occurred while fetching today's inquires: ${todayInquiresResponse.statusText}`,
          );
        }

        const todayInquiresData = await todayInquiresResponse.json();

        // Fetch inquires data
        const inquiresResponse = await fetch(
          "http://localhost:3000/inquire_db/inquires/read",
          {
            headers: {
              "x-api-key": apiKey,
            },
          },
        );
        if (!inquiresResponse.ok) {
          throw new Error(
            `An error occurred while fetching inquires: ${inquiresResponse.statusText}`,
          );
        }
        const inquiresData = await inquiresResponse.json();

        // Fetch Selected Offers
        const selectedOffersResponse = await fetch(
          "http://localhost:3000/offer_db/selected_offers/read",
          {
            headers: {
              "x-api-key": apiKey,
            },
          },
        );
        if (!selectedOffersResponse.ok) {
          throw new Error(
            `An error occurred while fetching selected offers: ${selectedOffersResponse.statusText}`,
          );
        }
        const selectedOffersData = await selectedOffersResponse.json();

        setEntries([
          { category: "Offers", count: offersData.length },
          { category: "Inquires", count: inquiresData.length },
          { category: "Today Offers", count: todayOffersData.length },
          { category: "Today Inquires", count: todayInquiresData.length },
          { category: "Selected Offers", count: selectedOffersData.length },
        ]);
        setTodayOffers(todayOffersData);
        setTodayInquires(todayInquiresData);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    }

    fetchEntries();
  }, []);

  return (
    <div>
      <div className="row justify-center">
        {entries.map((entry, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{entry.category}</h5>
                <p className="card-text">Total Entries: {entry.count}</p>
                <Link
                  to={`/${entry.category.toLowerCase()}`}
                  className="btn btn-primary"
                >
                  View {entry.category}
                </Link>
              </div>
            </div>
          </div>
        ))}
        <div className="row justify-center">
          <div className="col-md-4">
            <ServerActivity />
          </div>
        </div>
      </div>
      <h2>Today's Offers</h2>
      <div className="table-responsive">
        <table className="table-striped table">
          <thead>
            <tr>
              <th>#</th>
              <th>Order</th>
              <th>Offer ID</th>
            </tr>
          </thead>
          <tbody>
            {todayOffers.map((offer, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{offer.order}</td>
                <td>
                  {typeof offer.offer_id === "object"
                    ? offer.offer_id["$oid"]
                    : offer.offer_id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Today's Inquires</h2>
      <div className="table-responsive">
        <table className="table-striped table">
          <thead>
            <tr>
              <th>#</th>
              <th>Order</th>
              <th>Inquire ID</th>
            </tr>
          </thead>
          <tbody>
            {todayInquires.map((inquire, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{inquire.order}</td>
                <td>
                  {typeof inquire.inquire_id === "object"
                    ? inquire.inquire_id["$oid"]
                    : inquire.inquire_id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;

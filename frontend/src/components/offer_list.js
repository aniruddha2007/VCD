import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OfferList = (props) => {
  const { record } = props;
  //   console.log("Record:", record);

  // Check if record is defined and has the expected structure
  if (!record || (!record.sender && !record.user_id)) {
    // Render placeholder or handle the case where the data is not as expected
    return (
      <tr>
        <td colSpan="11">Invalid data</td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{record.sender || record.user_id}</td>
      <td>{record.timestamp}</td>
      <td>{record._id}</td>
      <td>{record.country}</td>
      <td>{record.mine_name}</td>
      <td>{record.typical_gar}</td>
      <td>{record.typical_ash}</td>
      <td>{record.typical_sulphur}</td>
      <td>{record.volume || ""}</td>
      <td>{record.laycan || ""}</td>
      <td>{record.port || ""}</td>
      <td>{record.status}</td>
      <td>
        <Link className="btn btn-link" to={`/edit/${record._id?.$oid}`}>
          Edit
        </Link>{" "}
        |
        <button
          className="btn btn-link"
          onClick={() => {
            props.deleteRecord(record._id?.$oid);
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

const OfferRecordList = () => {
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newOfferData, setNewOfferData] = useState({
    sender: "",
    timestamp: "",
    min_gar: "",
    max_gar: "",
    min_ash: "",
    max_ash: "",
    volume: "",
    laycan: "",
    port: "",
  });

  useEffect(() => {
    async function getOffers() {
      try {
        const response = await fetch(
          `http://localhost:3000/offer_db/offers/read`,
          {
            headers: {
              "x-api-key": "aniruddhaqwerty1234", // Replace 'your_api_key' with your actual API key
            },
          },
        );

        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }

        const offers = await response.json();
        // console.log("Offers:", offers);
        setRecords(offers);
      } catch (error) {
        window.alert(error.message);
      }
    }

    getOffers();

    return;
  }, []);

  async function deleteRecord(id) {
    try {
      await fetch(`http://localhost:3000/offer_db/offers/delete/${id}`, {
        method: "DELETE",
        headers: {
          "x-api-key": "aniruddhaqwerty1234", // Replace 'your_api_key' with your actual API key
        },
      });

      const newRecords = records.filter((el) => el._id.$oid !== id);
      setRecords(newRecords);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h3>Offer List</h3>
      <table className="table-striped table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Sender</th>
            <th>Timestamp</th>
            <th>Order ID</th>
            <th>Country</th>
            <th>Mine Name</th>
            <th>Typical GAR/GCV</th>
            <th>Typical Ash</th>
            <th>Typical Sulphur</th>
            <th>Volume</th>
            <th>Laycan</th>
            <th>Port</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <OfferList
              record={record}
              deleteRecord={deleteRecord}
              key={index}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OfferRecordList;

import React, { useEffect, useState } from "react";
//eslint-disable-next-line
import { Link } from "react-router-dom";

const SelectedOfferList = (props) => {
  const { record } = props;
  // console.log("Record:", record);

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
      <td>{record.order}</td>
      <td>{record.sender || record.user_id}</td>
      <td>{record.timestamp}</td>
      <td>{record._id}</td>
    </tr>
  );
};

const SelectedOfferRecordList = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function getSelectedOffers() {
      try {
        const response = await fetch(
          `http://localhost:3000/offer_db/selected_offers/read`,
          {
            headers: {
              "x-api-key": "aniruddhaqwerty1234", // Replace 'your_api_key' with your actual API key
            },
          },
        );

        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }

        const selectedOffers = await response.json();
        // console.log("Inquires:", inquires);
        setRecords(selectedOffers);
      } catch (error) {
        window.alert(error.message);
      }
    }

    getSelectedOffers();

    return;
  }, []);

  async function deleteRecord(id) {
    try {
      await fetch(
        `http://localhost:3000/offer_db/selected_offers/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "x-api-key": "aniruddhaqwerty1234", // Replace 'your_api_key' with your actual API key
          },
        },
      );

      const newRecords = records.filter((el) => el._id.$oid !== id);
      setRecords(newRecords);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h3>Selected Offers</h3>
      <table className="table-striped table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Sender</th>
            <th>Timestamp</th>
            <th>Order ID</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <SelectedOfferList
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

export default SelectedOfferRecordList;

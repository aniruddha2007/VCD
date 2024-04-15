import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreateInquire from "./create_inquire";
import EditInquire from "./edit_inquire";

const InquireList = (props) => {
  const { record } = props;

  // Check if record is defined and has the expected structure
  if (!record || (!record.sender && !record.user_id)) {
    // Render placeholder or handle the case where the data is not as expected
    return (
      <tr>
        <td colSpan="11">Invalid data</td>
      </tr>
    );
  }

  // Construct GAR range
  const garRange = `${record.min_gar || ""} - ${record.max_gar || ""}`;
  // Construct ASH range
  const ashRange = `${record.min_ash || ""} - ${record.max_ash || ""}`;

  return (
    <tr>
      <td>{record.sender || record.user_id}</td>
      <td>{record.timestamp}</td>
      <td>{record._id}</td>
      <td>{garRange}</td>
      <td>{ashRange}</td>
      <td>{record.volume || ""}</td>
      <td>{record.laycan || ""}</td>
      <td>{record.port || ""}</td>
      <td>
        <button className="btn btn-link" onClick={EditInquire}>
          Edit
          </button>
          {isEditInquireOpen && (
            <EditInquire
              editingInquireId={record._id
              closeModal={closeEditInquireModal}
              />
        |
        <button
          className="btn btn-link"
          onClick={() => {
            props.deleteRecord(record._id);
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

const InquireRecordList = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function getInquires() {
      try {
        const response = await fetch(
          `http://localhost:3000/inquire_db/inquires/read`,
          {
            headers: {
              "x-api-key": "aniruddhaqwerty1234", // Replace 'your_api_key' with your actual API key
            },
          },
        );

        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }

        const inquires = await response.json();
        setRecords(inquires);
      } catch (error) {
        window.alert(error.message);
      }
    }

    getInquires();

    return;
  }, []);

  async function deleteRecord(id) {
    try {
      await fetch(`http://localhost:3000/inquire_db/inquires/delete/${id}`, {
        method: "DELETE",
        headers: {
          "x-api-key": "aniruddhaqwerty1234", //api key
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
      <h3>Inquire List</h3>
      <CreateInquire />
      <table className="table-striped table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Sender</th>
            <th>Timestamp</th>
            <th>Order ID</th>
            <th>GAR</th>
            <th>ASH</th>
            <th>Volume</th>
            <th>Laycan</th>
            <th>Port</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <InquireList
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

export default InquireRecordList;

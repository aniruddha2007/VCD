import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const InquireList = (props) => {
    const { record } = props;
    // console.log("Record:", record);
  
    // Check if record is defined and has the expected structure
    if (!record || (!record.sender && !record.user_id)) {
      // Render placeholder or handle the case where the data is not as expected
      return <tr><td colSpan="11">Invalid data</td></tr>;
    }

    // Construct GAR range
    const garRange = `${record.min_gar || ''} - ${record.max_gar || ''}`;
    // Construct ASH range
    const ashRange = `${record.min_ash || ''} - ${record.max_ash || ''}`;
  
    return (
      <tr>
        <td>{record.sender || record.user_id}</td>
        <td>{record.timestamp}</td>
        <td>{garRange}</td>
        <td>{ashRange}</td>
        <td>{record.volume || ''}</td>
        <td>{record.laycan || ''}</td>
        <td>{record.port || ''}</td>
        <td>
          <Link className="btn btn-link" to={`/edit/${record._id?.$oid}`}>Edit</Link> |
          <button className="btn btn-link"
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

const InquireRecordList = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function getInquires() {
      try {
        const response = await fetch(`http://localhost:3000/inquire_db/inquires/read`, {
          headers: {
            'x-api-key': 'aniruddhaqwerty1234' // Replace 'your_api_key' with your actual API key
          }
        });

        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }

        const inquires = await response.json();
        // console.log("Inquires:", inquires);
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
          'x-api-key': 'aniruddhaqwerty1234' // Replace 'your_api_key' with your actual API key
        }
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
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Sender</th>
            <th>Timestamp</th>
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

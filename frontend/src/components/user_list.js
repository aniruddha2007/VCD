import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreateNewUser from "./User/create_user";

const UserRecord = (props) => (
  <tr>
    <td>{props.record.wa_id}</td>
    <td>{props.record.category}</td>
    <td>{props.record.userId}</td>
    <td>
      <Link className="btn btn-link" to={`/edit/${props.record._id?.$oid}`}>
        Edit
      </Link>{" "}
      |
      <button
        className="btn btn-link"
        onClick={() => {
          props.deleteRecord(props.record._id?.$oid);
        }}
      >
        Delete
      </button>
    </td>
  </tr>
);

const UserRecordList = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await fetch(
          `http://localhost:3000/user_data/users/read`,
          {
            headers: {
              "x-api-key": "aniruddhaqwerty1234", // Replace 'your_api_key' with your actual API key
            },
          },
        );

        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }

        const users = await response.json();
        setRecords(users);
      } catch (error) {
        window.alert(error.message);
      }
    }

    getUsers();

    return;
  }, []);

  async function deleteRecord(id) {
    try {
      console.log(id);
      await fetch(`http://localhost:3000/user_data/users/delete/${id}`, {
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
      <h3>User Record List</h3>
      <CreateNewUser />
      <table className="table-striped table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>WhatsApp ID</th>
            <th>Category</th>
            <th>User ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <UserRecord
              record={record}
              deleteRecord={deleteRecord}
              key={record._id?.$oid}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRecordList;

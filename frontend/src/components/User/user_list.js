import React, { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
import CreateNewUser from "./create_user";
import EditUserModal from "./edit_user";

const UserRecord = (props) => {
  const { record } = props;
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27 && isEditUserOpen) {
        closeEditUserModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditUserOpen]);

  const openEditUserModal = () => {
    setIsEditUserOpen(true);
  };

  const closeEditUserModal = () => {
    setIsEditUserOpen(false);
  };

  console.log(record._id);
  return (
    <tr>
      <td>{record.wa_id}</td>
      <td>{record.category}</td>
      <td>{record.userId}</td>
      <td>
        <button className="btn btn-link" onClick={openEditUserModal}>
          Edit
        </button>
        {isEditUserOpen && (
          <EditUserModal
            editingUserId={record._id}
            closeModal={closeEditUserModal}
          />
        )}
      </td>
      <td>
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
        // console.log("Users:", users);
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

      const newRecords = records.filter((el) => el._id !== id);
      setRecords(newRecords);
    } catch (error) {
      console.error(error);
    }
  }

  const modalRootRef = useRef(null);
  const modalRoot = modalRootRef.current;

  useEffect(() => {
    if (!modalRoot) {
      modalRootRef.current = document.createElement("div");
      modalRootRef.current.id = "modal-root";
      document.body.appendChild(modalRootRef.current);
    }
  }, [modalRoot]);

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
          {records.map((record, index) => (
            <UserRecord
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

export default UserRecordList;

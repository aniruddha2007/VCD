import Modal from "react-modal";
import React, { useState, useEffect, useRef } from "react";

Modal.setAppElement("#root");

const EditUserModal = ({ editingUserId }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/user_data/users/read/${editingUserId}`,
          {
            headers: {
              "x-api-key": "aniruddhaqwerty1234",
            },
          },
        );
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (editingUserId !== null) {
      fetchUser();
      setModalIsOpen(true);
    }
  }, [editingUserId]);

  const modalRootRef = useRef(null);
  const modalRoot = modalRootRef.current;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        wa_id: user.wa_id,
        userId: user.userId,
        category: user.category,
      };

      const response = await fetch(
        `http://localhost:3000/user_data/users/update/${editingUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "aniruddhaqwerty1234",
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }

      setModalIsOpen(false);
      window.alert("User updated successfully!");
      window.location.reload();
    } catch (error) {
      window.alert(`An error occurred: ${error.message}`);
      console.error(error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit User Modal"
        appElement={modalRoot}
        className="modal modal-dialog modal-dialog-centered"
        tabIndex="-1"
        role="dialog"
        aira-labelledby="editUserModal"
        aria-hidden="true"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editUserModal">
              Edit User
            </h5>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="wa_id">WA ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="wa_id"
                  name="wa_id"
                  value={user.wa_id}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="userId">User ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="userId"
                  name="userId"
                  value={user.userId}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  className="form-control"
                  id="category"
                  name="category"
                  value={user.category}
                  onChange={handleChange}
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default EditUserModal;

import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const CreateNewUser = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    wa_id: "",
    category: "",
    userId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/user_data/users/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "aniruddhaqwerty1234",
          },
          body: JSON.stringify(formData),
        },
      );
      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }
      window.alert("User created successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setModalIsOpen(true)}>
        Create New User
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="New User"
        className="modal modal-dialog modal-dialog-centered"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h3>Create New User</h3>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="form-group row">
                  <label htmlFor="wa_id" className="col-sm-2 col-form-label">
                    WhatsApp ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="wa_id"
                    name="wa_id"
                    value={formData.wa_id}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group row">
                  <label htmlFor="category" className="col-sm-2 col-form-label">
                    Category
                  </label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group row">
                  <label htmlFor="userId" className="col-sm-2 col-form-label">
                    User ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="userId"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateNewUser;

import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const CreateInquire = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    sender: "",
    timestamp: "",
    user: {
      userId: "",
      category: "",
    },
    country: "",
    mine_name: "",
    typical_gar: "",
    typical_ash: "",
    typical_sulphur: "",
    volume: "",
    laycan: "",
    port: "",
    status: "",
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

  const CloseModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setModalIsOpen(true)}>
        Create New Inquire
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={CloseModal}
        contentLabel="New Inquire"
        className="modal modal-dialog modal-dialog-centered"
        tabIndex="-1"
        role="dialog"
        aira-labelledby="create-inquire"
        aira-modal="true"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h3>Create New Inquire</h3>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group row">
                <label htmlFor="sender" className="col-sm-2 col-form-label">
                  Sender:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="sender"
                    value={formData.sender}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="timestamp" className="col-sm-2 col-form-label">
                  Timestamp:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="timestamp"
                    placeholder="YYYY-MM-DD HH:MM:SS"
                    value={formData.timestamp}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">User ID:</label>
                <div className="col-sm-4">
                  <input
                    type="text"
                    className="form-control"
                    value={formData.user.userId}
                    onChange={handleChange}
                  />
                </div>
                <label className="col-sm-2 col-form-label">Category:</label>
                <div className="col-sm-4">
                  <select
                    className="form-control"
                    value={formData.user.category}
                    onChange={handleChange}
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="country" className="col-sm-2 col-form-label">
                  Country:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="mine_name" className="col-sm-2 col-form-label">
                  Mine Name:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="mine_name"
                    value={formData.mine_name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="typical_gar"
                  className="col-sm-2 col-form-label"
                >
                  Typical GAR/GCV:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="typical_gar"
                    value={formData.typical_gar}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="typical_ash"
                  className="col-sm-2 col-form-label"
                >
                  Typical Ash:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="typical_ash"
                    value={formData.typical_ash}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="typical_sulphur"
                  className="col-sm-2 col-form-label"
                >
                  Typical Sulphur:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="typical_sulphur"
                    value={formData.typical_sulphur}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="volume" className="col-sm-2 col-form-label">
                  Volume:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="volume"
                    value={formData.volume}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="laycan" className="col-sm-2 col-form-label">
                  Laycan:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="laycan"
                    value={formData.laycan}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="port" className="col-sm-2 col-form-label">
                  Port:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="port"
                    value={formData.port}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="status" className="col-sm-2 col-form-label">
                  Status:
                </label>
                <div className="col-sm-10">
                  <select
                    className="form-control"
                    id="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Pending">Pending</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              Save changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default CreateInquire;

import Modal from "react-modal";
import React, { useState, useEffect, useRef } from "react";

Modal.setAppElement("#root");

const EditInquire = ({ editingInquireId }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [inquire, setInquire] = useState(null);

  useEffect(() => {
    const fetchInquire = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/user_data/inquires/read/${editingInquireId}`,
          {
            headers: {
              "x-api-key": "aniruddhaqwert1234",
            },
          },
        );
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        const data = await response.json();
        setInquire(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (editingInquireId !== null) {
      fetchInquire();
      setModalIsOpen(true);
    }
  }, [editingInquireId]);

  const modalRootRef = useRef(null);
  const modalRoot = modalRootRef.current;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInquire((prevInquire) => ({
      ...prevInquire,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        sender: inquire.sender,
        timestamp: inquire.timestamp,
        user: inquire.user,
        user_userId: inquire.user.userId,
        user_category: inquire.user.category,
        country: inquire.country,
        mine_name: inquire.mine_name,
        typical_gar: inquire.typical_gar,
        typical_ash: inquire.typical_ash,
        typical_sulphur: inquire.typical_sulphur,
        volume: inquire.volume,
        laycan: inquire.laycan,
        port: inquire.port,
        status: inquire.status,
      };

      const response = await fetch(
        `http://localhost:3000/inquire_db/inquires/update/${editingInquireId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "aniruddhaqwert1234",
          },
          body: JSON.stringify(requestBody),
        },
      );
      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }

      setModalIsOpen(false);
      window.alert("Inquire updated successfully!");
      window.location.reload();
    } catch (error) {
      window.alert(`An error occurred: ${error.message}`);
      console.error(error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (!inquire) {
    return null;
  }

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Inquire"
        appElement={modalRoot}
        className="modal modal-dialog modal-dialog-centered"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="Edit Inquire"
        aria-hidden="true"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Inquire</h5>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="sender">Sender</label>
                <input
                  type="text"
                  className="form-control"
                  id="sender"
                  name="sender"
                  value={inquire.sender}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="timestamp">Timestamp</label>
                <input
                  type="text"
                  className="form-control"
                  id="timestamp"
                  name="timestamp"
                  value={inquire.timestamp}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="user">UserId</label>
                <input
                  type="text"
                  className="form-control"
                  id="userId"
                  name="userId"
                  value={inquire.user.userId}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="user">Category</label>
                <input
                  type="text"
                  className="form-control"
                  id="category"
                  name="category"
                  value={inquire.user.category}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  className="form-control"
                  id="country"
                  name="country"
                  value={inquire.country}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="mine_name">Mine Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="mine_name"
                  name="mine_name"
                  value={inquire.mine_name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="typical_gar">Typical GAR</label>
                <input
                  type="text"
                  className="form-control"
                  id="typical_gar"
                  name="typical_gar"
                  value={inquire.typical_gar}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="typical_ash">Typical Ash</label>
                <input
                  type="text"
                  className="form-control"
                  id="typical_ash"
                  name="typical_ash"
                  value={inquire.typical_ash}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="typical_sulphur">Typical Sulphur</label>
                <input
                  type="text"
                  className="form-control"
                  id="typical_sulphur"
                  name="typical_sulphur"
                  value={inquire.typical_sulphur}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="volume">Volume</label>
                <input
                  type="text"
                  className="form-control"
                  id="volume"
                  name="volume"
                  value={inquire.volume}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="laycan">Laycan</label>
                <input
                  type="text"
                  className="form-control"
                  id="laycan"
                  name="laycan"
                  value={inquire.laycan}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="port">Port</label>
                <input
                  type="text"
                  className="form-control"
                  id="port"
                  name="port"
                  value={inquire.port}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <input
                  type="text"
                  className="form-control"
                  id="status"
                  name="status"
                  value={inquire.status}
                  onChange={handleChange}
                />
              </div>
            </form>
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
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default EditInquire;

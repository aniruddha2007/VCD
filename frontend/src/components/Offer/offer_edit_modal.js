import Modal from "react-modal";
import React, { useState, useEffect, useRef } from "react";

Modal.setAppElement("#root");

const EditOfferModal = ({ editingOfferId }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [offerData, setOfferData] = useState(null); // State to store offer data fetched from the server

  // UseEffect to fetch offer data when the modal is opened
  useEffect(() => {
    const fetchOfferData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/offer_db/offers/read/${editingOfferId}`,
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
        setOfferData(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (editingOfferId !== null) {
      fetchOfferData();
      setModalIsOpen(true); // Open the modal when editingOfferId is set
    }
  }, [editingOfferId]);

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
  };

  const modalRootRef = useRef(null);
  const modalRoot = modalRootRef.current;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfferData((prevOfferData) => ({
      ...prevOfferData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        pdf: pdfFile,
        sender: offerData.sender,
        timestamp: offerData.timestamp,
        user: offerData.user,
        mine_name: offerData.mine_name,
        typical_gar: offerData.typical_gar,
        typical_ash: offerData.typical_ash,
        typical_sulphur: offerData.typical_sulphur,
        volume: offerData.volume,
        laycan: offerData.laycan,
        port: offerData.port,
        status: offerData.status,
      };

      const response = await fetch(
        `http://localhost:3000/offer_db/offers/update/${editingOfferId}`,
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
      window.alert("Offer edited successfully!");
      // Refresh the page to see the updated offer
      window.location.reload();
    } catch (error) {
      window.alert("An error occurred while editing the offer.", error.message);
      console.error(error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (!offerData) {
    return null; // Render nothing until offer data is fetched
  }

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        appElement={modalRoot}
        contentLabel="Edit Offer"
        className="modal modal-dialog modal-dialog-centered"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Offer</h5>
          </div>
          {/*Edit Offer Form */}
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">Sender:</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="sender"
                    placeholder="sender"
                    value={offerData.sender}
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
                    name="timestamp"
                    value={offerData.timestamp}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* <div className="form-group row">
                <label htmlFor="userId" className="col-sm-2 col-form-label">
                  User ID:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="userId"
                    name="user.userId"
                    value={offerData.user.userId}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="category" className="col-sm-2 col-form-label">
                  Category:
                </label>
                <div className="col-sm-4">
                  <select
                    className="form-control"
                    id="category"
                    name="user.category"
                    value={offerData.user.category}
                    onChange={handleChange}
                  >
                    <option value="seller">Seller</option>
                    <option value="buyer">Buyer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div> */}

              <div className="form-group row">
                <label htmlFor="mine_name" className="col-sm-2 col-form-label">
                  Mine Name:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="mine_name"
                    name="mine_name"
                    value={offerData.mine_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label
                  htmlFor="typical_gar"
                  className="col-sm-2 col-form-label"
                >
                  Typical GAR:
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="typical_gar"
                    name="typical_gar"
                    value={offerData.typical_gar}
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
                    name="typical_ash"
                    value={offerData.typical_ash}
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
                    name="typical_sulphur"
                    value={offerData.typical_sulphur}
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
                    name="volume"
                    value={offerData.volume}
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
                    name="laycan"
                    value={offerData.laycan}
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
                    name="port"
                    value={offerData.port}
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
                    name="status"
                    value={offerData.status}
                    onChange={handleChange}
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="pdf" className="col-sm-2 col-form-label">
                  PDF:
                </label>
                <div className="col-sm-10">
                  <input
                    type="file"
                    className="form-control"
                    id="pdf"
                    accept=".pdf"
                    onChange={handlePdfFileChange}
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-seconday"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditOfferModal;

import Modal from "react-modal";
import React from "react";

Modal.setAppElement("#root");

const EditOfferModal = ({
  editingOfferId, // Ensure that editingOfferId is received as a prop
  editedOfferData = {
    sender: " ",
    timestamp: " ",
    user: {
      userId: " ",
      category: " ",
    },
    mine_name: " ",
    typical_gar: " ",
    typical_ash: " ",
    typical_sulphur: " ",
    volume: " ",
    laycan: " ",
    port: " ",
    status: " ",
  },
  setEditedOfferData = {
    sender: " ",
    timestamp: " ",
    user: {
      userId: " ",
      category: " ",
    },
    country: " ",
    mine_name: " ",
    typical_gar: " ",
    typical_ash: " ",
    typical_sulphur: " ",
    volume: " ",
    laycan: " ",
    port: " ",
    status: " ",
  },
  pdfFile,
  setPdfFile,
  closeEditModal,
}) => {
  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
  };

  console.log("Editing Offer ID:", editingOfferId);

  async function submitEditedOfferData() {
    try {
      const formData = new FormData();
      formData.append("sender", editedOfferData.sender);
      formData.append("timestamp", editedOfferData.timestamp);
      formData.append("user", JSON.stringify(editedOfferData.user));
      formData.append("user.userId", editedOfferData.user.userId);
      formData.append("user.category", editedOfferData.user.category);
      formData.append("country", editedOfferData.country);
      formData.append("mine_name", editedOfferData.mine_name);
      formData.append("typical_gar", editedOfferData.typical_gar);
      formData.append("typical_ash", editedOfferData.typical_ash);
      formData.append("typical_sulphur", editedOfferData.typical_sulphur);
      formData.append("volume", editedOfferData.volume);
      formData.append("laycan", editedOfferData.laycan);
      formData.append("port", editedOfferData.port);
      formData.append("status", editedOfferData.status);
      formData.append("pdfFile", pdfFile);

      console.log("formdatatype:", formData);
      const response = await fetch(
        `http://localhost:3000/offer_db/offers/update/${editingOfferId}`,
        {
          method: "PUT",
          headers: {
            "x-api-key": "aniruddhaqwerty1234",
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Updated Offer ID:", result);

      closeEditModal();
    } catch (error) {
      console.error("Error updating Offer:", error);
      window.alert(error.message);
    }
  }

  return (
    <Modal
      isOpen={editingOfferId !== null}
      onRequestClose={closeEditModal}
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
          <div className="form-group row">
            <label htmlFor="sender" className="col-sm-2 col-form-label">
              Sender:
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="sender"
                value={editedOfferData.sender}
                onChange={(e) =>
                  setEditedOfferData({
                    ...editedOfferData,
                    sender: e.target.value,
                  })
                }
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
                value={editedOfferData.timestamp}
                onChange={(e) =>
                  setEditedOfferData({
                    ...editedOfferData,
                    timestamp: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">User ID:</label>
            <div className="col-sm-4">
              <input
                type="text"
                className="form-control"
                id="user.userId"
                value={editedOfferData.user ? editedOfferData.user.userId : ""}
                onChange={(e) =>
                  setEditedOfferData({
                    ...editedOfferData,
                    user: {
                      ...editedOfferData.user,
                      userId: e.target.value,
                    },
                  })
                }
              />
            </div>
            <label className="col-sm-2 col-form-label">Category:</label>
            <div className="col-sm-4">
              <select
                className="form-control"
                value={editedOfferData.user.category}
                onChange={(e) =>
                  setEditedOfferData({
                    ...editedOfferData,
                    user: {
                      ...editedOfferData.user,
                      category: e.target.value,
                    },
                  })
                }
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
                value={editedOfferData.country}
                onChange={(e) =>
                  setEditedOfferData({
                    ...editedOfferData,
                    country: e.target.value,
                  })
                }
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
                value={editedOfferData.mine_name}
                onChange={(e) =>
                  setEditedOfferData({
                    ...editedOfferData,
                    mine_name: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="typical_gar" className="col-sm-2 col-form-label">
              Typical GAR/GCV:
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="typical_gar"
                value={editedOfferData.typical_gar}
                onChange={(e) =>
                  setEditedOfferData({
                    ...editedOfferData,
                    typical_gar: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="typical_ash" className="col-sm-2 col-form-label">
              Typical Ash:
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="typical_ash"
                value={editedOfferData.typical_ash}
                onChange={(e) =>
                  setEditedOfferData({
                    ...editedOfferData,
                    typical_ash: e.target.value,
                  })
                }
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
                value={editedOfferData.typical_sulphur}
                onChange={(e) =>
                  setEditedOfferData({
                    ...editedOfferData,
                    typical_sulphur: e.target.value,
                  })
                }
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
                value={editedOfferData.volume}
                onChange={(e) =>
                  setEditedOfferData({
                    ...editedOfferData,
                    volume: e.target.value,
                  })
                }
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
                value={editedOfferData.laycan}
                onChange={(e) =>
                  setEditedOfferData({
                    ...editedOfferData,
                    laycan: e.target.value,
                  })
                }
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
                value={editedOfferData.port}
                onChange={(e) =>
                  setEditedOfferData({
                    ...editedOfferData,
                    port: e.target.value,
                  })
                }
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
                value={editedOfferData.status}
                onChange={(e) =>
                  setEditedOfferData({
                    ...editedOfferData,
                    status: e.target.value,
                  })
                }
              >
                <option value="available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
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
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={submitEditedOfferData}
          >
            Save changes
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={closeEditModal}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditOfferModal;

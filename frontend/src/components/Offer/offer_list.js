import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-modal";
import EditOfferModal from "./offer_edit_modal";

//eslint-disable-next-line
let modalRoot = null;

const OfferList = (props) => {
  const { record, fetchPdf } = props;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27 && isEditModalOpen) {
        closeEditOfferModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditModalOpen]);

  const openEditOfferModal = () => {
    console.log("Edit offer modal opened");
    setIsEditModalOpen(true);
  };

  const closeEditOfferModal = () => {
    setIsEditModalOpen(false);
  };

  const handleDownloadPdf = () => {
    const id = record._id;
    if (id) {
      console.log("Downloading PDF for offer ID:", id);
      fetchPdf(id);
    } else {
      console.error("Invalid offer ID:", id);
    }
  };

  return (
    <tr>
      <td>{record.sender || record.user_id}</td>
      <td>{record.timestamp}</td>
      <td>{record._id}</td>
      <td>{record.country}</td>
      <td>{record.mine_name}</td>
      <td>{record.typical_gar}</td>
      <td>{record.typical_ash}</td>
      <td>{record.typical_sulphur}</td>
      <td>{record.volume || ""}</td>
      <td>{record.laycan || ""}</td>
      <td>{record.port || ""}</td>
      <td>{record.status}</td>
      <td>
        {/*// eslint-disable-next-line react/jsx-no-comment-textnodes, jsx-a11y/anchor-is-valid */}
        <button className="btn btn-link" onClick={handleDownloadPdf}>
          Download
        </button>
      </td>
      <td>
        <button className="btn btn-link" onClick={openEditOfferModal}>
          Edit
        </button>
        {isEditModalOpen && (
          <EditOfferModal
            editingOfferId={record._id}
            closeModal={closeEditOfferModal}
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
const OfferRecordList = () => {
  const [records, setRecords] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [newOfferData, setNewOfferData] = useState({
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

  const newOpenModal = () => {
    setModalIsOpen(true);
  };

  const newCloseModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    async function getOffers() {
      try {
        const response = await fetch(
          `http://localhost:3000/offer_db/offers/read`,
          {
            headers: {
              "x-api-key": "aniruddhaqwerty1234", // Replace 'your_api_key' with your actual API key
            },
          },
        );

        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }

        const offers = await response.json();
        // console.log("Offers:", offers);
        setRecords(offers);
      } catch (error) {
        window.alert(error.message);
      }
    }

    getOffers();

    return;
  }, []);

  async function deleteRecord(id) {
    try {
      await fetch(`http://localhost:3000/offer_db/offers/delete/${id}`, {
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

  //new offer form
  async function submitNewOffer() {
    try {
      const formData = new FormData();
      formData.append("sender", newOfferData.sender);
      formData.append("timestamp", newOfferData.timestamp);
      formData.append("user", JSON.stringify(newOfferData.user));
      formData.append("user.userId", newOfferData.user.userId);
      formData.append("user.category", newOfferData.user.category);
      formData.append("country", newOfferData.country);
      formData.append("mine_name", newOfferData.mine_name);
      formData.append("typical_gar", newOfferData.typical_gar);
      formData.append("typical_ash", newOfferData.typical_ash);
      formData.append("typical_sulphur", newOfferData.typical_sulphur);
      formData.append("volume", newOfferData.volume);
      formData.append("laycan", newOfferData.laycan);
      formData.append("port", newOfferData.port);
      formData.append("status", newOfferData.status);
      formData.append("pdf", pdfFile); // Append the PDF file

      console.log("formdatatype:", formData);
      const response = await fetch(
        `http://localhost:3000/offer_db/offers/create`,
        {
          method: "POST",
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
      console.log("New Offer created with ID:", result._id);

      //close modal after suyccessful submission
      newCloseModal();
    } catch (error) {
      window.alert(error.message);
      console.error("Error creating new offer:", error);
    }
  }

  //fetch pdf function
  async function fetchPdf(id) {
    try {
      const response = await fetch(
        `http://localhost:3000/offer_coa_upload/pdf/${id}`,
        {
          headers: {
            "x-api-key": "aniruddhaqwerty1234",
          },
        },
      );
      const pdfBlob = await response.blob();
      downloadpdf(pdfBlob, `COA_${id}.pdf`);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  }

  //download pdf function
  function downloadpdf(pdfBlob, fileName) {
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
  };

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
      <h3>Offer List</h3>
      <button
        className="btn btn-primary"
        data-toggle="modal"
        onClick={newOpenModal}
      >
        New Offer
      </button>
      <table className="table-striped table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Sender</th>
            <th>Timestamp</th>
            <th>Order ID</th>
            <th>Country</th>
            <th>Mine Name</th>
            <th>Typical GAR/GCV</th>
            <th>Typical Ash</th>
            <th>Typical Sulphur</th>
            <th>Volume</th>
            <th>Laycan</th>
            <th>Port</th>
            <th>Status</th>
            <th>Certificate of Analysis</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <OfferList
              record={record}
              fetchPdf={fetchPdf}
              deleteRecord={deleteRecord}
              key={index}
            />
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={newCloseModal}
        appElement={modalRoot}
        contentLabel="New Offer"
        className="modal modal-dialog modal-dialog-centered"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aira-hidden="true"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">New Offer</h5>
          </div>
          {/* New Offer Form */}
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
                  value={newOfferData.sender}
                  onChange={(e) =>
                    setNewOfferData({ ...newOfferData, sender: e.target.value })
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
                  placeholder="YYYY-MM-DD HH:MM:SS"
                  value={newOfferData.timestamp}
                  onChange={(e) =>
                    setNewOfferData({
                      ...newOfferData,
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
                  value={newOfferData.user.userId}
                  onChange={(e) =>
                    setNewOfferData({
                      ...newOfferData,
                      user: { ...newOfferData.user, userId: e.target.value },
                    })
                  }
                />
              </div>
              <label className="col-sm-2 col-form-label">Category:</label>
              <div className="col-sm-4">
                <select
                  className="form-control"
                  value={newOfferData.user.category}
                  onChange={(e) =>
                    setNewOfferData({
                      ...newOfferData,
                      user: { ...newOfferData.user, category: e.target.value },
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
                  value={newOfferData.country}
                  onChange={(e) =>
                    setNewOfferData({
                      ...newOfferData,
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
                  value={newOfferData.mine_name}
                  onChange={(e) =>
                    setNewOfferData({
                      ...newOfferData,
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
                  value={newOfferData.typical_gar}
                  onChange={(e) =>
                    setNewOfferData({
                      ...newOfferData,
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
                  value={newOfferData.typical_ash}
                  onChange={(e) =>
                    setNewOfferData({
                      ...newOfferData,
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
                  value={newOfferData.typical_sulphur}
                  onChange={(e) =>
                    setNewOfferData({
                      ...newOfferData,
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
                  value={newOfferData.volume}
                  onChange={(e) =>
                    setNewOfferData({ ...newOfferData, volume: e.target.value })
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
                  value={newOfferData.laycan}
                  onChange={(e) =>
                    setNewOfferData({ ...newOfferData, laycan: e.target.value })
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
                  value={newOfferData.port}
                  onChange={(e) =>
                    setNewOfferData({ ...newOfferData, port: e.target.value })
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
                  value={newOfferData.status}
                  onChange={(e) =>
                    setNewOfferData({ ...newOfferData, status: e.target.value })
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
              onClick={submitNewOffer}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={newCloseModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OfferRecordList;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

const OfferList = (props) => {
  const { record } = props;
//   console.log("Record:", record);

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

const OfferRecordList = () => {
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newOfferData, setNewOfferData] = useState({
    sender: "",
    timestamp: "",
    min_gar: "",
    max_gar: "",
    min_ash: "",
    max_ash: "",
    volume: "",
    laycan: "",
    port: ""
  });

  useEffect(() => {
    async function getOffers() {
      try {
        const response = await fetch(`http://localhost:3000/offer_db/offers/read`, {
          headers: {
            'x-api-key': 'aniruddhaqwerty1234' // Replace 'your_api_key' with your actual API key
          }
        });

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
          'x-api-key': 'aniruddhaqwerty1234' // Replace 'your_api_key' with your actual API key
        }
      });

      const newRecords = records.filter((el) => el._id.$oid !== id);
      setRecords(newRecords);
    } catch (error) {
      console.error(error);
    }
  }

  async function addNewOffer() {
    try {
        const formattedNewOfferData = {
            sender: newOfferData.sender,
            timestamp: newOfferData.timestamp,
            min_gar: newOfferData.min_gar,
            max_gar: newOfferData.max_gar,
            min_ash: newOfferData.min_ash,
            max_ash: newOfferData.max_ash, // Include max_ash as provided by the user
            volume: newOfferData.volume,
            laycan: newOfferData.laycan,
            port: newOfferData.port
        };

        console.log("New Offer Data:", formattedNewOfferData);

        const response = await fetch(`http://localhost:3000/offer_db/offers/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'aniruddhaqwerty1234' // Replace 'your_api_key' with your actual API key
            },
            body: JSON.stringify(formattedNewOfferData)
        });

        if (!response.ok) {
            throw new Error(`Failed to add new offer: ${response.statusText}`);
        }

        const newOffer = await response.json();

        setRecords([...records, newOffer]);
        handleCloseModal();
    } catch (error) {
        console.error(error.message);
        window.alert(`Error: ${error.message}`);
    }
}

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOfferData({
      ...newOfferData,
      [name]: value
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewOfferData({
      sender: "",
      timestamp: "",
      min_gar: "",
      max_gar: "",
      min_ash: "",
      max_ash: "",
      volume: "",
      laycan: "",
      port: ""
    });
  };

  const handleShowModal = () => setShowModal(true);

  return (
    <div>
      <h3>Offer List</h3>
      <Button variant="primary" onClick={handleShowModal}>Add New Offer</Button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formSender">
              <Form.Label>Sender</Form.Label>
              <Form.Control type="text" placeholder="Enter sender" name="sender" value={newOfferData.sender} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formTimestamp">
              <Form.Label>Timestamp</Form.Label>
              <Form.Control type="text" placeholder="Enter timestamp" name="timestamp" value={newOfferData.timestamp} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formMinGar">
              <Form.Label>Minimum GAR</Form.Label>
              <Form.Control type="text" placeholder="Enter minimum GAR" name="min_gar" value={newOfferData.min_gar} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formMaxGar">
              <Form.Label>Maximum GAR</Form.Label>
              <Form.Control type="text" placeholder="Enter maximum GAR" name="max_gar" value={newOfferData.max_gar} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formMinAsh">
              <Form.Label>Minimum ASH</Form.Label>
              <Form.Control type="text" placeholder="Enter minimum ASH" name="min_ash" value={newOfferData.min_ash} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formMaxAsh">
    <Form.Label>Maximum ASH</Form.Label>
    <Form.Control type="text" placeholder="Enter maximum ASH" name="max_ash" value={newOfferData.max_ash} onChange={handleInputChange} />
</Form.Group>
<Form.Group controlId="formIsMaxAshNull">
    <Form.Check type="checkbox" label="Is Max ASH Null?" name="is_max_ash_null" checked={newOfferData.is_max_ash_null} onChange={handleInputChange} />
</Form.Group>

            <Form.Group controlId="formVolume">
              <Form.Label>Volume</Form.Label>
              <Form.Control type="text" placeholder="Enter volume" name="volume" value={newOfferData.volume} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formLaycan">
              <Form.Label>Laycan</Form.Label>
              <Form.Control type="text" placeholder="Enter laycan" name="laycan" value={newOfferData.laycan} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formPort">
              <Form.Label>Port</Form.Label>
              <Form.Control type="text" placeholder="Enter port" name="port" value={newOfferData.port} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={addNewOffer}>Add Offer</Button>
        </Modal.Footer>
      </Modal>
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
            <OfferList
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

export default OfferRecordList;

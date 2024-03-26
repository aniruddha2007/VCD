import React, { useState } from "react";
import EditOfferModal from "./offer_edit_modal";

const ParentComponent = () => {
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [editedOfferData, setEditedOfferData] = useState({});
  const [pdfFile, setPdfFile] = useState(null);

  const handleEditModalClose = () => {
    // Implement the logic to close the edit modal
    setEditingOfferId(null);
  };

  return (
    <div>
      {/* Button to open the edit modal */}
      <button onClick={() => setEditingOfferId("6600e44001a2814d36921457")}>
        Edit Offer
      </button>
      {/* Render the edit modal */}
      <EditOfferModal
        editingOfferId={editingOfferId}
        editedOfferData={editedOfferData}
        setEditedOfferData={setEditedOfferData}
        setPdfFile={setPdfFile}
        closeEditModal={handleEditModalClose}
      />
    </div>
  );
};

export default ParentComponent;

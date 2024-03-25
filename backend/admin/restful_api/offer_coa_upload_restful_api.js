const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

// MongoDB connection
const mongoUrl = "mongodb://localhost:27017/offer_db"; // Your MongoDB connection URL
mongoose.connect(mongoUrl, { useNewUrlParser: true });

// Define schema for PDF details
const PdfDetailsSchema = new mongoose.Schema(
  {
    pdf: Buffer,

  },
  { collection: "offer_messages" }
);

const PdfDetails = mongoose.model("PdfDetails", PdfDetailsSchema);

router.get("/get-offers-with-coa", async (req, res) => {
  try {
    const data = await PdfDetails.find({ pdf: { $exists: true } }, { _id: 1 }); // Filter by the existence of the pdf field
    res.send({ status: "ok", data: data.map(doc => doc._id) }); // Return only the ObjectIDs
  } catch (error) {
    res.json({ status: error });
  }
});

router.get("/get-offers-without-coa", async (req, res) => {
  try {
    const data = await PdfDetails.find({ pdf: { $exists: false } }, { _id: 1 }); // Filter by the existence of the pdf field
    res.send({ status: "ok", data: data.map(doc => doc._id) }); // Return only the ObjectIDs
  } catch (error) {
    res.json({ status: error });
  }
});


// Route for getting a specific PDF file
router.get("/pdf/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const pdf = await PdfDetails.findById(id);

    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    // Set response header to indicate the content type
    res.setHeader('Content-Type', 'application/pdf');

    // Send the PDF content as the response
    res.send(pdf.pdf);
  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(500).json({ error: 'Error fetching PDF' });
  }
});

module.exports = router;

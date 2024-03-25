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
    pdf: Buffer, // Change data type to Buffer
    title: String,
    orderID: String,
  },
  { collection: "PdfDetails" }
);

const PdfDetails = mongoose.model("PdfDetails", PdfDetailsSchema);

const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory

// Route for uploading files
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const pdfData = req.file.buffer; // Retrieve PDF data from request buffer
    const { orderID } = req.body; // Extract orderID from request body

    if (!orderID) {
      return res.status(400).json({ error: 'OrderID is required' });
    }

    // Create new PdfDetails document with PDF data and orderID
    const newPdf = new PdfDetails({
      pdf: pdfData,
      orderID: orderID, // Assign the provided orderID
    });

    // Save the new document to MongoDB
    await newPdf.save();

    res.status(201).json({ status: "ok", message: "PDF uploaded successfully" });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ error: 'Error uploading PDF' });
  }
});


// Route for getting files
router.get("/get-files", async (req, res) => {
  try {
    const data = await PdfDetails.find({}, { _id: 1 }); // Only fetch the _id field
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

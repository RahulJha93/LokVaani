require('dotenv').config();
const express = require("express");
const cors = require("cors");
const uploadRoute = require("./routes/fileUpload.js");

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/server', (req, res) => {
  res.json({ status: 'ok' });
});


app.use("/api/upload", uploadRoute);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

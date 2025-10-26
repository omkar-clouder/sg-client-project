import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/importexport';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Data Schema
const DataSchema = new mongoose.Schema({
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const DataModel = mongoose.model('Data', DataSchema);

// Routes

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Save imported data
app.post('/api/save', async (req, res) => {
  try {
    const { data, fileName, fileType } = req.body;
    
    const savedData = new DataModel({
      data,
      fileName,
      fileType
    });
    
    await savedData.save();
    res.json({ success: true, id: savedData._id, message: 'Data saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all saved data
app.get('/api/data', async (req, res) => {
  try {
    const allData = await DataModel.find().sort({ uploadedAt: -1 });
    res.json({ success: true, data: allData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get specific data by ID
app.get('/api/data/:id', async (req, res) => {
  try {
    const data = await DataModel.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update data
app.put('/api/data/:id', async (req, res) => {
  try {
    const { data, fileName, fileType } = req.body;
    
    const updated = await DataModel.findByIdAndUpdate(
      req.params.id,
      { data, fileName, fileType, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }
    
    res.json({ success: true, data: updated, message: 'Data updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete data
app.delete('/api/data/:id', async (req, res) => {
  try {
    const deleted = await DataModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Data not found' });
    }
    res.json({ success: true, message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});



require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger/swagger.json');

const carRoutes = require('./routes/carRoutes');
const manufacturerRoutes = require('./routes/manufacturerRoutes');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

process.env.RENDER_URL = process.env.RENDER_URL || `http://localhost:${process.env.PORT || 8080}`;

swaggerDoc.servers = [
  {
    url: process.env.RENDER_URL,
    description: process.env.RENDER_URL.includes('localhost') ? 'Local Development Server' : 'Production Server (Render)'
  },
  {
    url: `http://localhost:${process.env.PORT || 8080}`,
    description: 'Localhost fallback'
  }
];

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Routes
app.use('/auth', authRoutes);
app.use('/cars', carRoutes);
app.use('/manufacturers', manufacturerRoutes);

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB Connected');
    const port = process.env.PORT || 8080;
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

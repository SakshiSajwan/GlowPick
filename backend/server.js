const express      = require('express');
const dotenv       = require('dotenv');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const connectDB    = require('./config/db');

dotenv.config();
console.log("ENV CHECK:", process.env.MONGO_URI);
connectDB(); 

const app = express();

// Middleware 
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Health check
app.get('/', (req, res) => res.send('API is running...'));

// Routes
app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/products',   require('./routes/productRoutes'));
app.use('/api/orders',     require('./routes/orderRoutes'));
app.use('/api/upload',     require('./routes/uploadRoutes'));
app.use('/api/recommend',  require('./routes/recommendationRoutes'));
app.use('/api/payment',    require('./routes/paymentRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));

// Error handlers
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
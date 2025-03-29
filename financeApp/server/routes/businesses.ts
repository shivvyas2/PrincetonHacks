import express, { RequestHandler } from 'express';
import Business from '../models/Business';

const router = express.Router();

// Test route to verify database connection
router.get('/test', (async (req, res) => {
  try {
    console.log('Testing database connection...');
    const count = await Business.countDocuments();
    console.log('Number of businesses in database:', count);
    const businesses = await Business.find();
    console.log('All businesses:', businesses);
    res.json({ 
      message: 'Database connection successful',
      count,
      businesses 
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}) as RequestHandler);

// Get all businesses
router.get('/', (async (req, res) => {
  try {
    console.log('Fetching all businesses...');
    const businesses = await Business.find();
    console.log('Found businesses:', businesses);
    res.json(businesses);
  } catch (error) {
    console.error('Error in GET /:', error);
    res.status(500).json({ 
      message: 'Error fetching businesses', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}) as RequestHandler);

// Get businesses by category
router.get('/category/:category', (async (req, res) => {
  try {
    const { category } = req.params;
    console.log('Fetching businesses for category:', category);
    const businesses = category === 'all' 
      ? await Business.find()
      : await Business.find({ category });
    console.log('Found businesses:', businesses);
    res.json(businesses);
  } catch (error: any) {
    console.error('Error in GET /category/:category:', error);
    res.status(500).json({ message: 'Error fetching businesses by category', error: error.message });
  }
}) as RequestHandler);

// Toggle favorite status
router.patch('/:id/favorite', (async (req, res) => {
  try {
    console.log('Toggling favorite for business:', req.params.id);
    const business = await Business.findById(req.params.id);
    if (!business) {
      console.log('Business not found:', req.params.id);
      return res.status(404).json({ message: 'Business not found' });
    }
    business.favorite = !business.favorite;
    await business.save();
    console.log('Updated business:', business);
    res.json(business);
  } catch (error: any) {
    console.error('Error in PATCH /:id/favorite:', error);
    res.status(500).json({ message: 'Error updating favorite status', error: error.message });
  }
}) as RequestHandler);

export default router; 
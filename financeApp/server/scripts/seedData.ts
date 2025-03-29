import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Business from '../models/Business';

dotenv.config();

const businesses = [
  {
    id: "1",
    name: "Green Leaf Cafe",
    description: "A sustainable cafe serving organic coffee and locally sourced food.",
    image: "https://picsum.photos/400/300",
    amount: 7250,
    daysLeft: 15,
    progress: 0.7,
    favorite: false,
    category: "cafe"
  },
  {
    id: "2",
    name: "Community Support Center",
    description: "A center providing resources and support for local communities.",
    image: "https://picsum.photos/400/300",
    amount: 1330,
    daysLeft: 23,
    progress: 0.4,
    favorite: false,
    category: "social"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Business.deleteMany({});
    console.log('Cleared existing data');

    // Insert new data
    await Business.insertMany(businesses);
    console.log('Seeded database with initial data');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 
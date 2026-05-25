const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  {
    name: 'Iron Pro Hex Dumbbell Set',
    description: 'Heavy-duty cast iron hex dumbbells with rubber coating. Available in pairs from 5kg to 30kg.',
    price: 2499,
    category: 'Dumbbells',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80',
  },
  {
    name: 'Neoprene Dumbbell Pair 5kg',
    description: 'Colour-coded neoprene coated dumbbells for comfortable grip. Non-slip surface.',
    price: 899,
    category: 'Dumbbells',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
  },
  {
    name: 'Adjustable Dumbbell 20kg',
    description: 'Space-saving adjustable dumbbell that replaces 10 pairs. Quick-change weight system.',
    price: 5999,
    category: 'Dumbbells',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80',
  },
  {
    name: 'Premium Non-Slip Yoga Mat 6mm',
    description: 'Extra thick 6mm TPE yoga mat with alignment lines. Superior grip on both sides, eco-friendly.',
    price: 1299,
    category: 'Yoga',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80',
  },
  {
    name: 'Yoga Block Set (2 Blocks)',
    description: 'High-density foam yoga blocks to support poses and improve flexibility. Lightweight yet sturdy.',
    price: 549,
    category: 'Yoga',
    stock: 75,
    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80',
  },
  {
    name: 'Yoga Strap & Resistance Band Kit',
    description: 'Set of 6 resistance bands plus a cotton yoga strap. Suitable for stretching and rehabilitation.',
    price: 799,
    category: 'Yoga',
    stock: 55,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
  },
  {
    name: 'Whey Protein Isolate 2kg',
    description: '90% protein per serving, zero sugar, low fat. Cold-processed whey isolate for fast absorption.',
    price: 3499,
    category: 'Protein',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80',
  },
  {
    name: 'Mass Gainer 3kg - Vanilla',
    description: 'High-calorie mass gainer with 1200 calories per serving. 50g protein + complex carbs.',
    price: 2799,
    category: 'Protein',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80',
  },
  {
    name: 'BCAA Recovery Drink Mix',
    description: '2:1:1 BCAA ratio with electrolytes. Reduces muscle soreness and speeds up recovery.',
    price: 1499,
    category: 'Protein',
    stock: 65,
    image: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600&q=80',
  },
  {
    name: 'Pro Jump Rope - Speed Cable',
    description: 'Lightweight aluminium handles with 3mm speed cable. Ball-bearing mechanism for smooth rotation.',
    price: 699,
    category: 'Cardio',
    stock: 90,
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&q=80',
  },
  {
    name: 'Gym Duffle Bag - 40L',
    description: 'Water-resistant polyester gym bag with wet/dry compartment, shoe pocket and bottle holder.',
    price: 1599,
    category: 'Accessories',
    stock: 42,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
  },
  {
    name: 'Foam Roller 45cm - Deep Tissue',
    description: 'High-density EVA foam roller for myofascial release and muscle recovery. Grid pattern surface.',
    price: 1099,
    category: 'Accessories',
    stock: 55,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Existing data cleared');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('customer123', salt);

    await User.create({
      name: 'Divyansh',
      email: 'customer@fitzone.com',
      password: hashedPassword,
      role: 'customer',
    });
    console.log('Demo user created: customer@fitzone.com / customer123');

    await Product.insertMany(products);
    console.log(`${products.length} products seeded successfully`);

    console.log('\nSeeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();

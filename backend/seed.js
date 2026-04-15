const db = require('./src/config/db');

async function seedData() {
  try {
    console.log('Connecting to database specifically for seeding...');
    
    // Check if categories already exist to prevent duplicate demo data
    const [existingCategories] = await db.execute('SELECT * FROM categories');
    if (existingCategories.length > 0) {
      console.log('Looks like data is already seeded! Products are ready.');
      process.exit(0);
    }

    console.log('Inserting sample Categories...');
    await db.execute("INSERT INTO categories (name) VALUES ('Electronics'), ('Computers'), ('Accessories')");

    console.log('Inserting sample Products...');
    const products = [
      {
        name: 'Apple iPhone 15 Pro (256 GB) - Natural Titanium',
        description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and a more versatile Pro camera system.',
        price: 1099.00,
        stock: 45,
        category_id: 1,
        image_url: 'https://m.media-amazon.com/images/I/81sigpKWFjL._AC_SX679_.jpg'
      },
      {
        name: 'MacBook Air 13-inch Apple M3 chip',
        description: 'Supercharged by M3. 8-core CPU, 10-core GPU, 8GB Unified Memory, 256GB SSD Storage.',
        price: 1099.00,
        stock: 20,
        category_id: 2,
        image_url: 'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SX679_.jpg'
      },
      {
        name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
        description: 'Industry Leading Noise Canceling with Auto NC Optimizer, crystal clear hands-free calling, up to 30-hour battery life.',
        price: 348.00,
        stock: 15,
        category_id: 3,
        image_url: 'https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SX679_.jpg'
      },
      {
        name: 'Amazon Fire TV 50" 4-Series 4K UHD smart TV',
        description: 'Brilliant 4K entertainment. Bring movies and shows to life with support for vivid 4K Ultra HD, HDR 10, HLG, and Dolby Digital Plus.',
        price: 299.99,
        stock: 100,
        category_id: 1,
        image_url: 'https://m.media-amazon.com/images/I/51A31B8t6qL._AC_SX679_.jpg'
      },
      {
        name: 'ASUS ROG Strix G16 (2024) Gaming Laptop',
        description: '16” 16:10 FHD 165Hz, GeForce RTX 4060, Intel Core i7-13650HX, 16GB DDR5, 1TB PCIe SSD, Wi-Fi 6E, Windows 11.',
        price: 1299.99,
        stock: 5,
        category_id: 2,
        image_url: 'https://m.media-amazon.com/images/I/81P2h0JdEzL._AC_SX679_.jpg'
      }
    ];

    for (let p of products) {
      await db.execute(
        "INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)",
        [p.name, p.description, p.price, p.stock, p.category_id, p.image_url]
      );
    }
    
    console.log('Seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedData();

const db = require('./src/config/db');

async function updateImages() {
  try {
    console.log('Connecting to database specifically for updating images...');

    // Replace Amazon hotlink protected URLs with highly reliable Unsplash commercial-free images
    await db.execute(`UPDATE products SET image_url = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop' WHERE name LIKE '%iPhone 15%'`);
    
    await db.execute(`UPDATE products SET image_url = 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=600&auto=format&fit=crop' WHERE name LIKE '%Fire TV%'`);
    
    await db.execute(`UPDATE products SET image_url = 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop' WHERE name LIKE '%ASUS ROG%'`);

    console.log('Images successfully fixed and updated to reliable URLs!');
    process.exit(0);
  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
}

updateImages();

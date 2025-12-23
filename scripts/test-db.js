
const { getProductById, getProducts } = require('../lib/db');
const path = require('path');
const fs = require('fs');

// Simple dotenv implementation for .env.local
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, '');
                process.env[key] = value;
            }
        });
        console.log('Loaded .env.local');
    } else {
        console.log('No .env.local found, will rely on lib/db.js fallbacks');
    }
} catch (e) {
    console.error('Error loading .env.local', e);
}

async function test() {
    console.log('Testing getProducts()...');
    try {
        const products = await getProducts();
        console.log(`Success! Got ${products.length} products.`);
        if (products.length > 0) {
            console.log('First product sample:', products[0]);
        }
    } catch (e) {
        console.error('FAIlED: getProducts() threw an error:', e);
    }

    console.log('\nTesting getProductById("5")...');
    try {
        const product = await getProductById('5');
        if (product) {
            console.log('Success! Found product:', product.name);
            console.log('Product Data:', product);
        } else {
            console.log('Product with ID "5" not found (but no error thrown).');
        }
    } catch (e) {
        console.error('FAIlED: getProductById("5") threw an error:', e);
    }

    console.log('\nTesting getProductById("NON_EXISTENT")...');
    try {
        const product = await getProductById('NON_EXISTENT');
        console.log('Result for non-existent:', product);
    } catch (e) {
        console.error('FAIlED: getProductById("NON_EXISTENT") threw an error:', e);
    }

    process.exit(0);
}

test();

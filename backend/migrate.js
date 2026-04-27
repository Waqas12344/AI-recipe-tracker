import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';


const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load environment variables
dotenv.config();


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

async function runMigration() {
    const client = await pool.connect();

    try {
        console.log('Running database migration...');

        // read the schema file 
        const schemaPath = path.join(__dirname, 'config', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');

        // execute the schema
        await client.query(schema);
        console.log('Database migration completed successfully!');
    } catch (err) {
        console.error('Error running migration:', err);
    } finally {
        client.release();
        pool.end();
    }
}

runMigration();

import pool from "../config/db.js";

const CreateUserTable = async () => {
      const queryText = `
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          age INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `;
try{
      await pool.query(queryText);
        console.log("Users table created or already exists.");
}catch(err){
      console.error("Error creating table:", err);
}
};
export default CreateUserTable;
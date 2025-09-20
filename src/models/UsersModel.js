import pool from "../config/db.js";

export const getAllUsersService = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};
export const getUserByIdService = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};
export const CreateUserService = async (userData) => {
  const { name, email, age } = userData;
  const result = await pool.query(
    "INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *",
    [name, email, age]
  );
  return result.rows[0];
};
export const updateUserService = async (id, userData) => {
  const { name, email, age } = userData;
  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4 RETURNING *",
    [name, email, age, id]
  );
  return result.rows[0];
};
export const deleteUserService = async (id) => {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

import express from "express";
const router = express.Router();

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/userController.js";

import {
  validateCreateUser,
  validateUpdateUser,
  validateUserId
} from "../Middleware/inputValidator.js";

// Routes
router.get("/users", getAllUsers);
router.get("/users/:id", validateUserId, getUserById);
router.post("/users", validateCreateUser, createUser);
router.put("/users/:id", validateUpdateUser, updateUser);
router.delete("/users/:id", validateUserId, deleteUser);

export default router;

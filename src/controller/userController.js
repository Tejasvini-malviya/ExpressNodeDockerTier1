import { 
  updateUserService,
  getAllUsersService,
  getUserByIdService,
  CreateUserService,
  deleteUserService
} from "../models/UsersModel.js";

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const createUser = async (req, res, next) => {
  const { name, email, age } = req.body;
  try {
    const newUser = await CreateUserService({ name, email, age });
    if (newUser) {
      handleResponse(res, 201, "User Created", newUser);
    }
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    if (users) {
      handleResponse(res, 200, "Users Retrieved", users);
    }
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await getUserByIdService(id);
    if (user) {
      handleResponse(res, 200, "User Retrieved", user);
    }
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  try {
    const updatedUser = await updateUserService(id, { name, email, age });
    if (updatedUser) {
      handleResponse(res, 200, "User Updated", updatedUser);
    }
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedUser = await deleteUserService(id);
    if (deletedUser) {
      handleResponse(res, 200, "User Deleted", deletedUser);
    }
  } catch (err) {
    next(err);
  }
};

import Joi from 'joi';

// User validation schema
const userSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 100 characters',
      'any.required': 'Name is required'
    }),
  
  email: Joi.string()
    .email()
    .max(100)
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'string.max': 'Email must not exceed 100 characters',
      'any.required': 'Email is required'
    }),
  
  age: Joi.number()
    .integer()
    .min(1)
    .max(150)
    .required()
    .messages({
      'number.base': 'Age must be a number',
      'number.integer': 'Age must be a whole number',
      'number.min': 'Age must be at least 1',
      'number.max': 'Age must not exceed 150',
      'any.required': 'Age is required'
    })
});

// User update validation schema (allows partial updates)
const userUpdateSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 100 characters'
    }),
  
  email: Joi.string()
    .email()
    .max(100)
    .optional()
    .messages({
      'string.empty': 'Email cannot be empty',
      'string.email': 'Please provide a valid email address',
      'string.max': 'Email must not exceed 100 characters'
    }),
  
  age: Joi.number()
    .integer()
    .min(1)
    .max(150)
    .optional()
    .messages({
      'number.base': 'Age must be a number',
      'number.integer': 'Age must be a whole number',
      'number.min': 'Age must be at least 1',
      'number.max': 'Age must not exceed 150'
    })
}).min(1).messages({
  'object.min': 'At least one field (name, email, or age) must be provided for update'
});

// ID parameter validation schema
const idSchema = Joi.number()
  .integer()
  .positive()
  .required()
  .messages({
    'number.base': 'ID must be a number',
    'number.integer': 'ID must be a whole number',
    'number.positive': 'ID must be a positive number',
    'any.required': 'ID is required'
  });

// Middleware for validating user creation
export const validateCreateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({
      status: 400,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// Middleware for validating user updates
export const validateUpdateUser = (req, res, next) => {
  // Validate ID parameter
  const { error: idError } = idSchema.validate(req.params.id);
  if (idError) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid user ID',
      errors: [idError.details[0].message]
    });
  }

  // Validate request body
  const { error } = userUpdateSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({
      status: 400,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// Middleware for validating user ID parameter
export const validateUserId = (req, res, next) => {
  const { error } = idSchema.validate(req.params.id);
  
  if (error) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid user ID',
      errors: [error.details[0].message]
    });
  }
  
  next();
};

// Generic validation function
export const validateData = (schema, data) => {
  return schema.validate(data, { abortEarly: false });
};

export default {
  validateCreateUser,
  validateUpdateUser,
  validateUserId,
  validateData,
  schemas: {
    userSchema,
    userUpdateSchema,
    idSchema
  }
};
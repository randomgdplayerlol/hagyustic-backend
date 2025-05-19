// Utility function to create a custom error object
// This helps in consistent error handling across the application

export const createError = (statusCode, message) => {
    const error = new Error(message); // Create a new Error object with the message
    error.statusCode = statusCode;    // Attach a custom status code
    return error;                     // Return the enhanced error object
  };
  
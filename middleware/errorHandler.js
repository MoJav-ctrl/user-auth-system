function errorHandler(err, req, res, next) {
    console.error(err.stack);
  
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errors: err.errors || null
      });
    }
  
    // Handle other types of errors
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
  
  module.exports = errorHandler;

  
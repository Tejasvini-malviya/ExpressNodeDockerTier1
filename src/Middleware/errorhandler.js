//centralized error handling function

const errorHandler = (err, req, res, next) => {
    console.log(err.stack);
    
    // Check if headers have already been sent
    if (res.headersSent) {
        return next(err);
    }
    
    res.status(500).json({
        status: 500,
        message: "Something broke!",
        error: err.message,
    });
}

export default errorHandler;
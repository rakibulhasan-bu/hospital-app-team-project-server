const ErrorMiddleware = (error, res) => {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Internal server error occurred";

    res.status(error.statusCode).json({
        success: false,
        message: error.message
    })
}

module.exports = { ErrorMiddleware };
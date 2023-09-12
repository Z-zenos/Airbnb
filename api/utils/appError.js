class AppError extends Error {
  statusCode;
  timestamp; // Time occuring error
  documentationUrl; // Documentation link for helping user
  isOperational;

  constructor(message, statusCode, documentationUrl) {
    super(message ? message : "A generic error occurred!");

    // Initializing the class properties;
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.timestamp = new Date().toISOString();
    this.documentationUrl = documentationUrl;

    /*
      Attaching a call stack to the current class, preventing the constructor 
      call to appear in the stack trace.
    */
    Error.captureStackTrace(this, this.contructor);
  }
}

module.exports = AppError;
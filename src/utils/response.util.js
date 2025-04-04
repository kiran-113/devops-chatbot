function createErrorResponse(message) {
    return {
      success: false,
      error: message
    };
  }

  function createSuccessResponse(data) {
    return {
      success: true,
      data
    };
  }

  module.exports = {
    createErrorResponse,
    createSuccessResponse
  };
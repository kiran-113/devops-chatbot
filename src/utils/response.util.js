function createErrorResponse(message) {
  return {
      success: false,
      error: message,
  };
}

function createSuccessResponse(data) {
  return {
      success: true,
      data,
  };
}

module.exports = {
  createErrorResponse,
  createSuccessResponse,
};

// //file:utils/response.util.js
// function createErrorResponse(message) {
//     return {
//       success: false,
//       error: message
//     };
//   }

//   function createSuccessResponse(data) {
//     return {
//       success: true,
//       data
//     };
//   }

//   module.exports = {
//     createErrorResponse,
//     createSuccessResponse
//   };
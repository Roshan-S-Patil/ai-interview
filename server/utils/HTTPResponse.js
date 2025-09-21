// utils/httpResponse.js

const ERROR_CODES = {
  VALIDATION_FAILED: "ERR_400",
  SERVER_ERROR: "ERR_500",
};

export const success = (result = [], message = "Successfully processed.") => {
  return {
    statusCode: 200,
    body: {
      success: true,
      result,
      message,
    },
  };
};

export const error = (
  message = "Error encountered.",
  statusCode = 500,
  error = "SERVER_ERROR",
  result = []
) => {
  return {
    statusCode,
    body: {
      success: false,
      error_code: ERROR_CODES[error] || "ERR_001",
      result,
      message,
    },
  };
};

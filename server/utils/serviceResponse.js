// utils/serviceResponse.js

export const success = (data = {}, message = "") => ({
  success: true,
  message,
  data,
  meta: {
    timestamp: new Date().toISOString(),
  },
});

export const error = (
  message = "Error encountered.",
  statusCode = 500,
  errorCode = "",
  data = []
) => ({
  success: false,
  error_code: errorCode || `ERR_${statusCode}`,
  status_code: statusCode,
  message,
  data,
  meta: {
    timestamp: new Date().toISOString(),
  },
});

export const info = (successFlag = true, data = [], message = "") => ({
  success: successFlag,
  message,
  data,
  meta: {
    timestamp: new Date().toISOString(),
  },
});

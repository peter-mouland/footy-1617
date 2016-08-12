
export function checkStatus(response) {
  if (response.status < 200 || response.status >= 300) {
    const error = new Error(response.statustext);
    error.response = response;
    throw error;
  }
  return response;
}

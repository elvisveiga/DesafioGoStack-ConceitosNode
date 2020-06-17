module.exports = function toResult(data, errors = []) {
  return {
    success: !errors.length > 0,
    data,
    errors
  }
}


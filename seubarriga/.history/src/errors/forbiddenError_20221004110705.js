/* eslint-disable no-undef */
module.exports = function forbiddenError(message = 'This feature cannot be accessed by the user who is logged in') {
  this.name = 'ForbiddenError';
  this.message = message;
};
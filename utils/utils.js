function sendMessage(response, status, message) {
  response
    .status(status)
    .send({ message });
}

module.exports = {
  sendMessage,
};

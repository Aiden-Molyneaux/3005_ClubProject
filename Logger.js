class Logger {
  static getRequestReceived() { console.log('GET request received'); }

  static postRequestReceived() { console.log('POST request received'); }

  static patchRequestReceived() { console.log('PATCH request received'); }

  static putRequestReceived() { console.log('PUT request received'); }

  static deleteRequestReceived() { console.log('DELETE request received'); }

  static signupRequestReceived() { console.log('SIGNUP request received'); }

  static loginRequestReceived() { console.log('LOGIN request received'); }

  static isAuthenticatedRequestReceived() { console.log('IS AUTHENTICATED request received'); }
}

module.exports = Logger;

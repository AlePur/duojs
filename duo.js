const EventEmitter = require('events');
const request = require('request');

function Api(user, pass) {
  this.app = new EventEmitter();
  this.token = (() => {
    return new Promise((resolve, reject) => {
      request.post({
        url: 'https://www.duolingo.com/login',
        json: {
          "login": user,
          "password": pass
        }
      }, (err, res, body) => {
        const { statusCode } = res;
        let error;
        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
        } else {
          if (body.failure) {
            error = new Error(body.message);
          }
        }
        if (error) {
          throw error;
        }
        resolve(res.headers['jwt']);
      });
    });
  })().then((x) => {
    this.token = x;
    this.app.emit('ready');
  });
  this.getUserObject = (name) => {
    return new Promise((resolve, reject) => {
      request.get({
        url: 'https://www.duolingo.com/users/'+name,
        headers: {
          'Authorization': this.token
        }
      }, (err, res, body) => {
        const { statusCode } = res;
        let error;
        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
        }
        if (error) {
          console.error(error.message);
          // Consume response data to free up memory
          res.resume();
          return;
        }
        resolve(JSON.parse(body));
      });
    });
  }
}

module.exports = {
  Api: Api
}

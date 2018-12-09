class RequestMaker {
  constructor(fs) {
    this.request = require('request');
    this.fs = fs;
  }

  post(url, filepath, uploadName) {
    const r = this.request.post({
      url: url,
    }, (err, res, body) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Request Maker: Request made');
      }
    });

    r.form().append(uploadName, this.fs.createReadStream(filepath));
  }
}

module.exports = RequestMaker;

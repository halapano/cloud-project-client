class UI {
  // display error message below the navbar
  showErr() {

    this.clearErr();

    // get needed elements
    const uploadForm = document.getElementById('upload-form');
    const parent = document.getElementById('upload-card');
    const errDiv = document.create.createElement('div');

    // add class name
    errDiv.className = 'alert alert-danger';

    // add text to err
    errDiv.appendChild(global.document.createTextNode('You forgot fill in something'));

    // insert err div
    parent.insertBefore(errDiv, uploadForm);

    // remove err message after 3 sec
    setTimeout(() => {
      this.clearAlert()
    }, 3000);

  }

  clearErr() {
    const currentErr = document.querySelector('.alert');

    if (currentErr) {
      currentErr.remove();
    }
  }
}

module.exports = UI;

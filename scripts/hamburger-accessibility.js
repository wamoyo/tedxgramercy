;(function () {
  "use strict"
  window.addEventListener('DOMContentLoaded', function () {

    document.getElementById('nav-toggle').addEventListener('keyup', function (event) {
      if (event.keyCode == 13 && this.checked) {
        //event.preventDefault()
        this.checked = false
      } else if (event.keyCode == 13 && !this.checked) {
        //event.preventDefault()
        this.checked = true
      }
    }, false)

  }, false)
}());


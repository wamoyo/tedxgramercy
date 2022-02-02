
// Form fields, validation and such.

;(function () {
  "use strict"

  tg.fields = function () {
    return {
      create: function (options) {
        if (options.type === 'name') return createNameField(options)
        if (options.type === 'email') return createEmailField(options)
        if (options.type === 'tickets') return createTicketsField(options)
      }
    }
  }

  function createNameField (options) {
    // input(id=`${event.id}-name-element`, type='text', placeholder='Your Name', name='name').field
    var div = document.getElementById(options.id)
    var inputError = document.getElementById(options.id + '-error')
    var inputFlash = document.getElementById(options.id + '-flash')
    var input = document.createElement('input')
    input.setAttribute('class', 'field')
    input.setAttribute('type', 'text')
    input.setAttribute('name', 'name')
    input.setAttribute('value', '')
    input.setAttribute('required', 'true')
    input.setAttribute('maxlength', 100) // limits characters
    input.setAttribute('placeholder', 'Your Name')

    // Append the field
    div.appendChild(input)

    // Error message on max characters
    input.addEventListener('keyup', function (event) {
      if (this.value.length === 100) inputError.textContent = "That's a very long name. Try using just your first name."
    }, false)

    // Remove error message
    input.addEventListener('input', function (event) {
      if (this.value.length < 100) inputError.textContent = ""
    }, false)

    return {
      div: div,
      inputError: inputError,
      inputFlash: inputFlash,
      input: input
    }
  }


  function createEmailField (options) {
    // input(id=`${event.id}-email-element`, type='email', placeholder='your@email.com', name='email').field
    var div = document.getElementById(options.id)
    var inputError = document.getElementById(options.id + '-error')
    var inputFlash = document.getElementById(options.id + '-flash')
    var input = document.createElement('input')
    input.setAttribute('class', 'field')
    input.setAttribute('type', 'email')
    input.setAttribute('name', 'email')
    input.setAttribute('value', '')
    input.setAttribute('required', 'true')
    input.setAttribute('maxlength', 350) // limits characters
    input.setAttribute('placeholder', 'your@email.com')

    // Append the field
    div.appendChild(input)

    // Check for @ symbol.
    input.addEventListener('change', function (event) {
      if (!this.value.match(/@/)) inputError.textContent = "Your email address doesn't appear to have an @ symbol."
    }, false)

    input.addEventListener('input', function (event) {
      if (this.value.match(/@/) || this.value === '') inputError.textContent = ""
    }, false)

    input.addEventListener('change', function (event) {
      if (this.value === '') inputError.textContent = ""
    }, false)

    // Force to lowercase.
    input.addEventListener('input', function (event) {
      this.value = this.value.toLowerCase()
    }, false)


    // Error message on max characters (350)
    input.addEventListener('keyup', function (event) {
      if (this.value.length === 350) inputError.textContent = "You just passed the world record for longest email. Try using a shorter one."
    }, false)

    // Remove error message for max chars.
    input.addEventListener('input', function (event) {
      if (this.value.length < 350) inputError.textContent = ""
    }, false)


    return {
      div: div,
      inputError: inputError,
      inputFlash: inputFlash,
      input: input
    }
  }


  function createTicketsField (options) {
    // input(id=`${event.id}-tickets-element`, type='number', placeholder='Up to 20 tickets', min='1', max='20', name='tickets').field
    var div = document.getElementById(options.id)
    var inputError = document.getElementById(options.id + '-error')
    var inputFlash = document.getElementById(options.id + '-flash')
    var priceDiv = document.getElementById(options.id + '-price')
    var input = document.createElement('input')
    input.setAttribute('class', 'field')
    input.setAttribute('type', 'number')
    input.setAttribute('name', 'tickets')
    input.setAttribute('min', 1)
    input.setAttribute('max', options.cap)
    input.setAttribute('step', 1)
    input.setAttribute('value', '')
    input.setAttribute('placeholder', options.cap === 1 ? options.cap + ' ticket left' : options.cap + ' tickets left')

    div.appendChild(input)

    // TODO Check server for number of tickets left.

    // Force only numbers from 1 to cap (and empty string) in the field.
    var temp = ''
    input.addEventListener('input', function (event) {
      if (this.value == '') return
      if (this.value < 1 || this.value > options.cap || this.value.match(/\D/)) return this.value = temp
      temp = this.value
    }, false)

    // TODO CONTINUE HERE. The problem is that the value for these dynamically generated inputs doesn't work.

    // Auto adjust total price display on the fly.
    input.addEventListener('input', function (event) {
      var price = options.price * this.value
      priceDiv.textContent = '$' + price
    }, false)

    return {
      div: div,
      inputError: inputError,
      inputFlash: inputFlash,
      input: input
    }
  }

}());


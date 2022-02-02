;(function () {
  "use strict"
  window.addEventListener('load', function (event) {

    var elements = stripe.elements()
    var fields = tg.fields()
    var price = 25

    var form = document.getElementById(tg.formId + '-form')
    var submit = document.getElementById(tg.formId + '-submit')
    var tickets

    // Check if there are tickets left
    fetch('/api/remainingTickets', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ slug: tg.formId })
    }).then(function(response) {
      console.info(response)
      return response.json()
    }).then(function(json) {
      console.log(JSON.parse(json))
      var json = JSON.parse(json)
      if (json.status != 404 && json.body && json.body.remainingTickets > 0) {
        form.style.display = 'block'

        tickets = fields.create({
          id: tg.formId + '-tickets',
          type: 'tickets',
          price: price,
          cap: json.body.remainingTickets
        })
      } else {
        document.getElementById('sold-out').style.display = 'block'
      }
    }).catch(function(err) {
      console.error(err)
      document.getElementById('ticket-form-error').style.display = 'block'
    })

    var name = fields.create({
      id: tg.formId + '-name',
      type: 'name'
    })
    var email = fields.create({
      id: tg.formId + '-email',
      type: 'email'
    })
    var card = elements.create('card', {
      style: {
        base: {
          fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          fontSize: '16px',
          lineHeight: '24px'
        }
      }
    })
    card.mount('#' + tg.formId + '-card')
    var cardError = document.getElementById(tg.formId + '-card-error')
    var success = document.getElementById(tg.formId + '-success')
    var fail = document.getElementById(tg.formId + '-fail')

    // Card Validation

    card.on('change', function (event) {
      if (event.error) {
        cardError.textContent = event.error.message
      } else {
        cardError.textContent = ''
      }
    })

    /*
     * Submit data to salon-tickets API endpoint
     */

    // TODO Make sure there are no errors.

    submit.addEventListener('click', function (event) {
      event.preventDefault()
      submit.setAttribute('disabled', 'disabled')

      stripe.createToken(card).then(function(result) {
        if (result.error) {
          cardError.textContent = result.error.message
          submit.removeAttribute('disabled')
        } else {
          var formData = {
            id: tg.formId,
            email: email.input.value,
            name: name.input.value,
            tickets: tickets.input.value,
            token: result.token.id,
          }
          console.log(formData)
          submitTicketForm(formData)
        }
      })

    }, false)


    function submitTicketForm(formData) {
      fetch('/api/createChargeForTickets', {
        method: 'POST',
        body: JSON.stringify(formData)
      }).then(function(response) {
        console.info(response)
        return response.json()
      }).then(function(json) {
        console.log(json)
        if (json.body.error) {
          //create error message
          fail.innerHTML = "There's been an error. Error message: " + json.body.error.message + ". If you need support, please email <a href='mailto:events@tedxgramercy.com?subject=Having Trouble Purchasing Tickets'>events@tedxgramercy.com.</a>"
          //remove hidden class from confirmation message
          success.classList.add('hidden')
          fail.classList.remove('hidden')
        } else {
          //create success message
          success.textContent = 'Ticket Purchase Confirmed! We emailed your receipt to ' + json.body.charge.receipt_email + '.'
          //clear form
          form.reset()
          card.clear()
          //remove hidden class from confirmation message
          fail.classList.add('hidden')
          success.classList.remove('hidden')
          setTimeout(function() {
            success.classList.add('hidden')
          },8000)
        }
        submit.removeAttribute('disabled')
      }).catch(function(err) {
        console.error(err)
        //create error message
        fail.innerHTML = "There's been an error. Error message: " + err.message + ". If you need support, please email <a href='mailto:events@tedxgramercy.com?subject=Having Trouble Purchasing Tickets'>events@tedxgramercy.com.</a>"
        //remove hidden class from confirmation message
        success.classList.add('hidden')
        fail.classList.remove('hidden')
        submit.removeAttribute('disabled')
      })
    }

  }, false)
}());


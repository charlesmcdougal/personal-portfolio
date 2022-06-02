const formToSubmit = document.querySelector("#message-form")
const dbUrl = "https://mcdougal-resume-default-rtdb.firebaseio.com/"

//pop up the modal if there's an error
const showModal = (title, message) => {
  document.querySelector(".modal").style.display = 'flex'
  document.querySelector(".modal-title").innerText = title
  document.querySelector(".modal-message").innerText = message
}

formToSubmit.addEventListener("submit", async (e) => {
  e.preventDefault()
  
  let messageData = {}
  let isError = false

  //disable the button while waiting for a response
  formToSubmit.querySelector("button[type=submit]").disabled = true

  //build an object with key value pairs from the form from all inputs and textareas
  for(i=0; i < e.target.length; i++) {
    if(e.target[i].nodeName === "INPUT" || e.target[i].nodeName === "TEXTAREA") {
      messageData = {
        ...messageData,
        [e.target[i].name]: e.target[i].value
      }
    }
  }

  // run some simple client-side auth here
  if(messageData.name.length < 1 || messageData.name.length >= 30) {
    formToSubmit.querySelector("input[name=name]").classList.remove("form-no-error")
    formToSubmit.querySelector("input[name=name]").classList.add("form-error")
    isError = true
  }
  if(messageData.email.length < 1) {
    formToSubmit.querySelector("input[name=email]").classList.remove("form-no-error")
    formToSubmit.querySelector("input[name=email]").classList.add("form-error")
    isError = true
  } 
  if(messageData.message.length < 5 || messageData.message.length >= 800) {
    formToSubmit.querySelector("textarea[name=message]").classList.remove("form-no-error")
    formToSubmit.querySelector("textarea[name=message]").classList.add("form-error")
    isError = true
  }
  if(isError) {
    formToSubmit.querySelector("button[type=submit]").disabled = false
    return
  } 

  const response = await fetch(`${dbUrl}messages.json`, {
    method: 'POST',
    body: JSON.stringify(messageData),
    headers: {
      'Content-Type': 'application/json'
    },
  })
  if(!response.ok) {
    showModal("Connection Error", `There was an error communicating with the server. Please make sure the form is filled out correctly, or contact me with the email link.`)
    //enable the button in case they want to try again
    formToSubmit.querySelector("button[type=submit]").disabled = false
  } else {
    showModal("Thank you!", "Thank you so much for reaching out to me! I will be in touch with you soon.")
    
    //clear the form
    const labeledElements = formToSubmit.querySelectorAll("input, textarea")
    labeledElements.forEach(element => {
      element.value = ''
      element.previousElementSibling.classList.remove("label-animation")
    })

    //enable the button after a short delay
    setTimeout(() => {
      formToSubmit.querySelector("button[type=submit]").disabled = false
    },2000)
  }
})
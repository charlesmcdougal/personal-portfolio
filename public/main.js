//----LABEL AND FORM ANIMATION/EFFECT SCRIPTS----//

//select the form for triggering label animation
const contactForm = document.querySelector("#message-form")

//this is the counter after the message
const messageCounter = document.querySelector(".message-counter")

//check to see if the input already has values when the page loads (only in Mozilla?)
//and apply the label animation class so there's no overlap in the input
window.onload = () => {
  const labeledElements = contactForm.querySelectorAll("input, textarea")
  labeledElements.forEach(element => {
    if(element.value !== "") {
      element.previousElementSibling.classList.add("label-animation")
    }
  })
}

//check what the form element is - only labels on inputs and text areas should animate
contactForm.addEventListener("focusin", (e) => {
  if(e.target.nodeName === "INPUT" || e.target.nodeName === "TEXTAREA") {
    e.target.classList.remove("form-error")
    e.target.previousElementSibling.classList.add("label-animation")
  }
})

//remove the label if the input is empty and loses focus
contactForm.addEventListener("focusout", (e) => {
  if(e.target.value === '') {
    e.target.previousElementSibling.classList.remove("label-animation")
  }
  if(e.target.value === '' && e.target.nodeName === "TEXTAREA") {
    messageCounter.innerText = ''
  }
})

//controls the counter in the textarea
contactForm.addEventListener("input", (e) => {
  if(e.target.nodeName === "TEXTAREA") {
    const numOfChars = e.target.value.length
    messageCounter.innerText = `${numOfChars} / 800`
    if(numOfChars > 4 && numOfChars < 800) {
      messageCounter.style.color = "rgba(255,255,255,0.8)"
    } else {
      messageCounter.style.color = "rgba(255,200,200,0.8)"
    }
  }
})

//this code triggers the autoscroll to the contact form
const scrollLink = document.querySelector("#trigger-scroll")
const scrollContainer = document.querySelector(".wrapper")

scrollLink.addEventListener("click", (e) => {
  e.preventDefault()
  scrollContainer.scroll({
    top: scrollContainer.scrollHeight*2,
    left: 0,
    behavior: "smooth"
  })
})

//hide the modal if it's on screen 
const modal = document.querySelector(".modal")

modal.addEventListener("click", (e) => {
  modal.style.display = 'none'
})

//-------------------------------------------//
//----CODE THAT HANDLES THE CONTACT ME FORM--//
//-------------------------------------------//
const dbUrl = "https://mcdougal-resume-default-rtdb.firebaseio.com/"

//pop up the modal if there's an error
const showModal = (title, message) => {
  document.querySelector(".modal").style.display = 'flex'
  document.querySelector(".modal-title").innerText = title
  document.querySelector(".modal-message").innerText = message
}

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  
  let messageData = {}
  let isError = false

  //disable the button while waiting for a response
  contactForm.querySelector("button[type=submit]").disabled = true

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
    contactForm.querySelector("input[name=name]").classList.add("form-error")
    isError = true
  }
  if(messageData.email.length < 1) {
    contactForm.querySelector("input[name=email]").classList.add("form-error")
    isError = true
  } 
  if(messageData.message.length < 5 || messageData.message.length >= 800) {
    contactForm.querySelector("textarea[name=message]").classList.add("form-error")
    isError = true
  }
  if(isError) {
    contactForm.querySelector("button[type=submit]").disabled = false
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
    contactForm.querySelector("button[type=submit]").disabled = false
  } else {
    showModal("Thank you!", "Thank you so much for reaching out to me! I will be in touch with you soon.")
    
    //clear the form
    messageCounter.innerText = `0 / 800`
    const labeledElements = contactForm.querySelectorAll("input, textarea")
    labeledElements.forEach(element => {
      element.value = ''
      element.previousElementSibling.classList.remove("label-animation")
    })

    //enable the button after a short delay
    setTimeout(() => {
      contactForm.querySelector("button[type=submit]").disabled = false
    }, 2000)
  }
})
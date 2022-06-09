//----LABEL AND FORM ANIMATION/EFFECT SCRIPTS----//

//select the form for triggering label animation
const contactForm = document.querySelector("#message-form")

//this is the counter after the message
const messageCounter = document.querySelector(".message-counter")

//pop up the modal - takes a string and an element to append
const showModal = (title, message, bgColor) => {
  document.querySelector(".modal-overlay").style.display = 'flex'
  document.querySelector(".modal-title").innerText = title
  document.querySelector(".modal-message").innerHTML = message
  if(bgColor) {
    console.log(bgColor)
    document.querySelector(".modal-banner").style.backgroundColor = bgColor
  }
}

//hide the modal if it's on screen 
const modal = document.querySelector(".modal-overlay")
modal.addEventListener("click", (e) => {
  if(e.target.classList.contains("modal-close") || e.target.classList.contains("modal-overlay")) {
    modal.style.display = "none"
  }
})

//----MODAL MESSAGES----//
const aboutMeListener = document.querySelector("main > ul")
aboutMeListener.addEventListener("click", (e) => {
  e.preventDefault()
  let title = ""
  let message = ""
  let bgColor = ""
  if(e.target.id === "skills") {
    title = "My Development Skills"
    bgColor = "var(--accent-color-1)"
    message = `
      <p><span class="bold">React</span> – Learned Redux, Router v6, Next.js, custom hooks, deployment, API
      interaction through Udemy course, personal projects</p>
      <p><span class="bold">Node.js</span> – Learned Express server, MongoDB, Mongoose, Postman and Jest (for
      testing), socket.io through Udemy course</p>
      <p><span class="bold">JavaScript</span> – Learned through university courses, Udemy courses, personal
      projects; proficient with DOM manipulation, API interaction, JSON, concepts
      like async/await, destructuring, closures, hoisting</p>
      <p><span class="bold">HTML 5/CSS 3</span> – Clear understanding of the DOM, developer tools in
      Firefox/Chrome, modern CSS practices: variables, media queries, flexbox, grid,
      animation, accessibility</p>
      <p><span class="bold">Digital Art</span> – Proficient with Photoshop and Illustrator, open-source tools
      including InkScape and GIMP, mock-ups with Figma</p>
    `
    showModal(title, message, bgColor)
  }
  if(e.target.id === "education") {
    title = "My Education"
    bgColor = "var(--accent-color-2)"
    message = `
      <p><span class="bold">University of Maine</span>, Orono, Maine 2008<br />
      Graduated with Bachelor of Arts in New Media</p>
      <p><span class="bold">Udemy: The Complete Node.js Developer Course (3rd Edition)</span> January 2022</p>
      <p><span class="bold">Udemy: React - The Complete Guide</span> June 2022</p>
     `
     showModal(title, message, bgColor)
  }
  if(e.target.id === "interests") {
    title = "My Interests and Hobbies"
    bgColor = "var(--accent-color-4)"
    message = `
      <p>typography and design, computer games, origami, squash, 
      fitness, cooking, mountain biking, photography, making music</p>
    `
    showModal(title, message, bgColor)
  }
})

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

//this code triggers the autoscroll to the appropriate section
const scrollLink = document.querySelector("#trigger-scroll")
const scrollContainer = document.querySelector(".wrapper")

scrollLink.addEventListener("click", (e) => {
  e.preventDefault()
  // let scrollTo = 0
  if(e.target.text === "projects") {
    document.querySelector("#projects").scrollIntoView({ behavior: 'smooth', block: 'start'})
  }
  if(e.target.text === "contact") {
    document.querySelector("#contact").scrollIntoView({ behavior: 'smooth', block: 'start'})
  }
})

//-------------------------------------------//
//----CODE THAT HANDLES THE CONTACT ME FORM--//
//-------------------------------------------//
const dbUrl = "https://mcdougal-resume-default-rtdb.firebaseio.com/"

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

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  
  let messageData = {}
  let isError = false

  //disable the button while waiting for a response
  contactForm.querySelector("button[type=submit]").disabled = true

  //build an object with key value pairs from the form from all inputs and textareas
  for(let i=0; i < e.target.length; i++) {
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
    const errorTitle = "Connection Error"
    const errorMessage = `<p>There was an error communicating with the server. Please make sure the form is filled out correctly, or <a href="mailto:charlesmcdougal@gmail.com">contact me</a>.</p>`
    const bgColor = "var(--accent-color-1)"
    showModal(errorTitle, errorMessage, bgColor)
    //enable the button in case they want to try again
    contactForm.querySelector("button[type=submit]").disabled = false
  } else {
    const successTitle = "Thank you!" 
    const successMessage = `<p>Thank you so much for reaching out to me! I will be in touch with you soon.</p>`
    const bgColor = "var(--accent-color-4)"
    showModal(successTitle, successMessage, bgColor)
    
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
const accordianAnimation = () => {
  const scrollContainer = document.querySelector(".wrapper")
  const elementsToCollapse = document.querySelectorAll("#accordian > div")
  const animatedBar = document.querySelector(".animated-bar")
  let initViewportHeight = 0
  let lastKnownScrollPosition = 0
  let ticking = false
  let count = elementsToCollapse.length
  let scrollModifier = 1/count
  let totalHeight = 0

  //this setTimeout avoids a bug in Chrome browsers where it doesn't initially calculate the offset height until other things are rendered -  even a small delay is enough
  //this variable isn't used until the scroll event, so it doesn't need a specific value when the page first loads
  setTimeout(() => { 
    initViewportHeight = scrollContainer.offsetHeight 
  }, 20)

  const accordianElements = (scrollPos) => {
    //the height needs to be recalculated to aviod bugs with screen resizing, esp. on mobile
    totalHeight = scrollContainer.offsetHeight
    elementsToCollapse.forEach((element, val) => {
      //use Math.ceil to round up to nearest whole number - gets rid of gaps on desktop browsers that round fractional values down
      element.style.height = Math.ceil(totalHeight/count + scrollPos*(1-scrollModifier*(val+1))) + "px"
    })
  }

  //the scroll occurs inside of an element that has overflow set to "auto", which is why we don"t use the "document" element here
  //the page itself doesn't actually have its own scrollbar - this makes calculating the container height easier because it doesn't change unless resized
  //this would probably work with document scroll as well, but I haven't tried it
  scrollContainer.addEventListener("scroll", (e) => {
    lastKnownScrollPosition = scrollContainer.scrollTop

    //this code may reduce the number of times the scroll event is calculated - should be less CPU intensive
    if (!ticking) {
      window.requestAnimationFrame(() => {
        accordianElements(lastKnownScrollPosition)
        ticking = false
      })
      ticking = true
    }

    //this triggers the color bar animation in the second section
    //the -100 triggers the animation a bit before the scroll finishes
    if(lastKnownScrollPosition > initViewportHeight - 100) {
      animatedBar.classList.add("bar-animation")
    }
  })

  let timeout = false // holder for timeout id
  let delay = 150 // delay after event is "complete" to run callback

  // window.resize callback function
  const resizeCallback = () => {
    //run the resize function
    accordianElements(lastKnownScrollPosition)
  }

  // window.resize event listener
  window.addEventListener("resize", () => {
    // clear the timeout
    clearTimeout(timeout);
    // start timing for event "completion"
    timeout = setTimeout(resizeCallback, delay)
  });

  //check to see of the phone's orientation has changed and resize the elements
  screen.orientation.addEventListener("change", () => {
    clearTimeout(timeout)
    timeout = setTimeout(resizeCallback, delay)
  })
}
accordianAnimation()
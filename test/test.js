//div that contains accordian - must be child of 'body' element
const accordianContainer = document.querySelector("#accordian")

//value is what % of screen height accordian should occupy
//code only works at 100vh atm, but may change in the future
let accordianHeight = 100

//each array element represents a colored row of the accordian
const accordianRows = [
  "rgb(234, 89, 70)",
  "rgb(240, 144, 71)",
  "rgb(235, 186, 82)",
  "rgb(13, 152, 172)",
]

//initialize variables
let viewportHeight = window.innerHeight
let lastKnownScrollPosition = 0
let scrollOffset = 0
let ticking = false

//Chrome doesn't calculate offsetTop correctly on initial load - small delay is needed
let accordianContainerTop = 0 
setTimeout(() => {
  accordianContainerTop = accordianContainer.offsetTop
}, 20)

//assign the height to the accordian element
accordianContainer.style.height = accordianHeight + "vh"

//no overflow - keeps page from changing in height in case of math errors
accordianContainer.style.overflow = "hidden"
accordianContainer.style.flexDirection = "column"

//create the colored rows - each a fraction of the total height
accordianRows.forEach((element) => {
  const bar = document.createElement("div")
  bar.style.backgroundColor = element 
  bar.style.height = accordianHeight / accordianRows.length + "vh"
  bar.style.width = "100vw"
  accordianContainer.appendChild(bar)
});

//calculate the container height in pixels after adding divs
let containerHeight = accordianContainer.offsetHeight
console.log("container height: " + containerHeight)

//select the newly created divs
const rowsToResize = document.querySelectorAll("#accordian > div")
const count = accordianRows.length

//this function is triggered on scroll event
accordianChangeHeight = (scrollPos) => {
  scrollOffset = accordianContainerTop - viewportHeight - scrollPos + containerHeight
  console.log(scrollOffset)
  rowsToResize.forEach((element, val) => {
    //expand the first row to fill the container height if offset is negative
    if(scrollOffset/containerHeight <=0 && val === 0) {
      element.style.height = containerHeight/count + Math.abs(scrollOffset * (1-1/count)) + "px"
    } else {
      element.style.height = containerHeight/count * (1-Math.abs(scrollOffset/containerHeight)) + "px" 
    }
  })
}

document.addEventListener("scroll", () => {
  lastKnownScrollPosition = Math.ceil(window.scrollY)

  //use requestAnimationFrame to reduce # of calls
  if (!ticking) {
    window.requestAnimationFrame(() => {
      accordianChangeHeight(lastKnownScrollPosition)
      ticking = false
    })
    ticking = true
  }
})

let timeout = false // holder for timeout id
let delay = 100 // delay after event is "complete" to run callback

// window.resize callback function
const resizeCallback = () => {
  //run the resize function
  accordianChangeHeight(lastKnownScrollPosition)
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
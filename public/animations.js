const triggerAnimations = (() => {
  const scrollContainer = document.querySelector("#accordian");
  const elementsToCollapse = document.querySelectorAll("#accordian > div");
  let initViewportHeight = 0;
  let lastKnownScrollPosition = 0;
  let ticking = false;
  let count = elementsToCollapse.length;
  let scrollModifier = 1 / count;
  let totalHeight = 0;

  let projectsYPosition = 0;

  //so it won't attempt to add the same class multiple times
  let barAnimationTriggered = false;
  let projectsAnimationTriggered = false;

  //wait till everything has loaded before calculating the offset height
  window.onload = function () {
    initViewportHeight = scrollContainer.offsetHeight;
    console.log(scrollContainer.offsetHeight);
    projectsYPosition = document.querySelector("#projects").offsetTop;
    console.log(projectsYPosition);
  };

  const accordianElements = (scrollPos) => {
    //the height needs to be recalculated to avoid bugs with screen resizing, esp. on mobile
    totalHeight = scrollContainer.offsetHeight;

    elementsToCollapse.forEach((element, val) => {
      //use Math.ceil to round up to nearest whole number - gets rid of gaps on desktop browsers that round fractional values down
      element.style.height =
        Math.ceil(
          totalHeight / count + scrollPos * (1 - scrollModifier * (val + 1))
        ) + "px";
    });
  };

  document.addEventListener("scroll", () => {
    lastKnownScrollPosition = window.scrollY;

    //this code may reduce the number of times the scroll event is calculated - should be less CPU intensive
    if (!ticking) {
      window.requestAnimationFrame(() => {
        accordianElements(lastKnownScrollPosition);
        ticking = false;
      });
      ticking = true;
    }

    //this triggers the color bar animation in the second section
    if (
      !barAnimationTriggered &&
      lastKnownScrollPosition > initViewportHeight - 100
    ) {
      const animatedBar = document.querySelector(".animated-bar");
      animatedBar.classList.add("bar-animation");
      barAnimationTriggered = true;
    }

    //triggers the cards appearing in
    if (
      !projectsAnimationTriggered &&
      lastKnownScrollPosition >
        projectsYPosition - document.querySelector("#projects").offsetHeight / 2
    ) {
      const cardList = document.querySelectorAll(".project-grid > div");
      cardList.forEach((element, val) => {
        setTimeout(() => {
          element.classList.add("card-animation");
        }, 200 * val);
      });
      projectsAnimationTriggered = true;
    }
  });

  let timeout = false; // holder for timeout id
  let delay = 150; // delay after event is "complete" to run callback

  // window.resize callback function
  const resizeCallback = () => {
    //run the resize function
    accordianElements(lastKnownScrollPosition);
  };

  // window.resize event listener
  window.addEventListener("resize", () => {
    // clear the timeout
    clearTimeout(timeout);
    // start timing for event "completion"
    timeout = setTimeout(resizeCallback, delay);
  });

  //check to see of the phone's orientation has changed and resize the elements
  screen.orientation.addEventListener("change", () => {
    clearTimeout(timeout);
    timeout = setTimeout(resizeCallback, delay);
  });
})();

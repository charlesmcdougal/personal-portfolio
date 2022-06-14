const triggerAnimations = (() => {
  //selectors for the accordian effect
  const scrollContainer = document.querySelector("#accordian");
  const elementsToCollapse = document.querySelectorAll("#accordian > div");

  //init vars for the accordian effect
  let count = elementsToCollapse.length;
  let scrollModifier = 1 / count;
  let initViewportHeight = 0;
  let lastKnownScrollPosition = 0;
  let totalHeight = 0;
  let ticking = false;

  //selectors for the different page sections
  const aboutSection = document.querySelector("#about");
  const projectsSection = document.querySelector("#projects");
  const contactSection = document.querySelector("#contact");
  const cardList = document.querySelectorAll(".project-grid > div");
  let sectionScrolledTo = "";
  let aboutYPosition = 0;
  let projectsYPosition = 0;
  let contactYPosition = 0;

  //so it won't attempt to add the same class multiple times
  let barAnimationTriggered = false;
  let projectsAnimationTriggered = false;

  //wait till everything has loaded before calculating the offset height
  window.onload = function () {
    initViewportHeight = scrollContainer.offsetHeight;
    aboutYPosition = aboutSection.offsetTop;
    projectsYPosition = projectsSection.offsetTop;
    contactYPosition = contactSection.offsetTop;
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
        projectsYPosition - projectsSection.offsetHeight / 2
    ) {
      cardList.forEach((element, val) => {
        setTimeout(() => {
          element.classList.add("card-animation");
        }, 200 * val);
      });
      projectsAnimationTriggered = true;
    }
    if (projectsAnimationTriggered && lastKnownScrollPosition < 10) {
      cardList.forEach((element) => {
        element.classList.remove("card-animation");
      });
      projectsAnimationTriggered = false;
    }

    //adds nav decoration when scrolling to a section
    if (
      sectionScrolledTo !== "main" &&
      lastKnownScrollPosition < aboutYPosition - 300
    ) {
      document
        .querySelector(".orange-scroll")
        .classList.remove("orange-scroll-anim");
      document
        .querySelector(".yellow-scroll")
        .classList.remove("yellow-scroll-anim");
      document
        .querySelector(".light-blue-scroll")
        .classList.remove("light-blue-scroll-anim");
      sectionScrolledTo = "main";
    }
    if (
      sectionScrolledTo !== "about" &&
      lastKnownScrollPosition > aboutYPosition - 300 &&
      lastKnownScrollPosition < projectsYPosition - 300
    ) {
      document
        .querySelector(".orange-scroll")
        .classList.add("orange-scroll-anim");
      document
        .querySelector(".yellow-scroll")
        .classList.remove("yellow-scroll-anim");
      document
        .querySelector(".light-blue-scroll")
        .classList.remove("light-blue-scroll-anim");
      sectionScrolledTo = "about";
    }
    if (
      sectionScrolledTo !== "projects" &&
      lastKnownScrollPosition > projectsYPosition - 300 &&
      lastKnownScrollPosition < contactYPosition - 300
    ) {
      document
        .querySelector(".yellow-scroll")
        .classList.add("yellow-scroll-anim");
      document
        .querySelector(".orange-scroll")
        .classList.remove("orange-scroll-anim");
      document
        .querySelector(".light-blue-scroll")
        .classList.remove("light-blue-scroll-anim");
      sectionScrolledTo = "projects";
    }
    if (
      sectionScrolledTo !== "contact" &&
      lastKnownScrollPosition > contactYPosition - 300
    ) {
      document
        .querySelector(".light-blue-scroll")
        .classList.add("light-blue-scroll-anim");
      document
        .querySelector(".yellow-scroll")
        .classList.remove("yellow-scroll-anim");
      document
        .querySelector(".orange-scroll")
        .classList.remove("orange-scroll-anim");
      sectionScrolledTo = "contact";
    }
  });

  let timeout = false; // holder for timeout id
  let delay = 150; // delay after event is "complete" to run callback

  // window.resize callback function
  const resizeCallback = () => {
    //run the resize function
    accordianElements(lastKnownScrollPosition);
  };

  // update accordian position if window resizes
  window.addEventListener("resize", () => {
    // clear the timeout
    clearTimeout(timeout);
    // start timing for event "completion"
    timeout = setTimeout(resizeCallback, delay);
  });

  //update accordian position if phone orientation changes
  screen.orientation.addEventListener("change", () => {
    clearTimeout(timeout);
    timeout = setTimeout(resizeCallback, delay);
  });
})();

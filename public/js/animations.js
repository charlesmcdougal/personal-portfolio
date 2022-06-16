const triggerAnimations = (() => {
  let lastKnownScrollPosition = 0;
  let initViewportHeight = 0;

  //selectors for the different page sections
  const viewportContainer = document.querySelector("#accordian");
  const aboutSection = document.querySelector("#about");
  const projectsSection = document.querySelector("#projects");
  const contactSection = document.querySelector("#contact");
  const cardList = document.querySelectorAll(".project-grid > div");
  const navBar = document.querySelector("nav");
  let navBarIsColored = false;
  let sectionScrolledTo = "";
  let aboutYPosition = 0;
  let projectsYPosition = 0;
  let contactYPosition = 0;

  //so it won't attempt to add the same class multiple times
  let barAnimationTriggered = false;
  let projectsAnimationTriggered = false;

  //wait till everything has loaded before calculating the offset height
  window.onload = function () {
    initViewportHeight = viewportContainer.offsetHeight;
    aboutYPosition = aboutSection.offsetTop;
    projectsYPosition = projectsSection.offsetTop;
    contactYPosition = contactSection.offsetTop;
  };

  document.addEventListener("scroll", () => {
    lastKnownScrollPosition = window.scrollY;

    //this triggers the background on the navbar
    if (!navBarIsColored && lastKnownScrollPosition > aboutYPosition) {
      console.log(navBarIsColored);
      navBar.style.backgroundColor = "var(--main-color)";
      navBarIsColored = true;
    }
    if (navBarIsColored && lastKnownScrollPosition < aboutYPosition) {
      navBar.style.backgroundColor = "transparent";
      navBarIsColored = false;
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
})();

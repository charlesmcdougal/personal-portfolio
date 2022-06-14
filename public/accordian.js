const accordianAnimation = (() => {
  // each element in the array will be rendered as a bar with a given background color
  const accordianBars = [
    "var(--accent-color-1)",
    "var(--accent-color-2)",
    "var(--accent-color-3)",
    "var(--accent-color-4)",
  ];

  //selector for the accordian effect
  const accordianContainer = document.querySelector("#accordian");

  //generate the bars
  accordianBars.forEach((element, val) => {
    const newBar = document.createElement("div");
    newBar.style.position = "absolute";
    newBar.style.left = "0";
    newBar.style.width = "100vw";
    newBar.style.height = 100 / accordianBars.length + "vh";
    newBar.style.zIndex = -1 - val;
    newBar.style.backgroundColor = element;
    newBar.style.top = (100 / accordianBars.length) * val + "vh";
    accordianContainer.appendChild(newBar);
  });

  //now that the divs have been added,, select them all
  const elementsToCollapse = document.querySelectorAll("#accordian > div");

  //init vars for the accordian effect
  let count = elementsToCollapse.length;
  let scrollModifier = 1 / count;
  let initViewportHeight = 0;
  let lastKnownScrollPosition = 0;
  let totalHeight = 0;
  let ticking = false;

  window.onload = function () {
    initViewportHeight = accordianContainer.offsetHeight;
  };

  //this function runs every time a scroll event is triggered
  const resizeElements = (scrollPos) => {
    //the height needs to be recalculated to avoid bugs with screen resizing, esp. on mobile
    totalHeight = accordianContainer.offsetHeight;

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
        resizeElements(lastKnownScrollPosition);
        ticking = false;
      });
      ticking = true;
    }
  });
  let timeout = false; // holder for timeout id
  let delay = 150; // delay after event is "complete" to run callback

  // window.resize callback function
  const resizeCallback = () => {
    //run the resize function
    resizeElements(lastKnownScrollPosition);
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

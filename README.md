# personal-portfolio

Thank you for checking out my personal portfolio.

Just about all of the code here was written from scratch. I didn't want to use any 3rd-party code for this as a sort of personal challenge to myself but also to learn how everything works on a deeper level. There are still a few things I intend to add, such as a modal pop-up gallery so I can add pictures to the projects section.

### recent updates

I moved the code for the accordian effect to its own file. I also set it up so it dynamically generates the bars based on an array of color values. The more colors added to the array, the more bars are generated. It should be pretty much drag-and-drop now. Instructions for using it can be found below.

Navigation links are now underlined based on which section the page is scrolled to. I've also removed the wrapper around the page for more consistent scrolling on various devices and to return the scrollbar to the document level. This also means that the page can still be scrolled even with a modal overlay covering everything.

### using the accordian

The accordian effect can only be used on the top of a page and only at 100vh/vw. I've been working on another version that can be resized and put in other page sections, but it's still too buggy. If you want to use in on your page for whatever reason, then you'll need the accordian.js and accordian.css files.

On the main page, at the top, you'll also need the following html:

```html
  <div id="accordian">
    <h1>
      (masthead text goes here)
    </h1>
  </div>
```

You can add or remove horizontal bars by going into accordian.js and adding a color to the array accordianBars array. It's applied as a CSS style, so you can use whatever format you like: rgb, hsl, hex, or a variable from another CSS file, as I did. The array is currently populated with css accent color vars:

```javascript
  const accordianBars = [
    "var(--accent-color-1)",
    "var(--accent-color-2)",
    "var(--accent-color-3)",
    "var(--accent-color-4)",
  ];
```
You'll have to add these vars to a .css file or hard-code in the values that you would like, like this:

```javascript
  const accordianBars = [
    "red",
    "orange",
    "yellow",
    "lightblue",
  ];
```

### licence information

This project is licenced under the MIT licence, which is shared in the main directory. Feel free to do what you'd like with the code, just remember to keep the licence with it.


function myFunction() {
  const myBody = document.getElementById("myBody");
  myBody.dataset.bsTheme = myBody.dataset.bsTheme == "light" ? "dark" : "light";

  var svgElement = document.getElementById("sysLogo");
  // Get all <path> elements within the SVG
  var pathElements = svgElement.getElementsByTagName("path");

  // Loop through each <path> element
  for (var i = 0; i < pathElements.length; i++) {
    var pathElement = pathElements[i];
    var originalColor = pathElement.getAttribute("data-original-fill");

    if (myBody.dataset.bsTheme == "dark") {
      // Set the fill color to white
        pathElement.setAttribute("fill", "#FFFFFF");
      } else {
      // Switch back to the original color
        pathElement.setAttribute("fill", originalColor);
      }
  }
}

  // Hoover effects on logo icon
  document.addEventListener("DOMContentLoaded", function () {
      const chartIcon = document.getElementById("chartIcon");

      chartIcon.addEventListener("mouseenter", () => {
        chartIcon.setAttribute("name", "stats-chart");
      });

      chartIcon.addEventListener("mouseleave", () => {
        chartIcon.setAttribute("name", "stats-chart-outline");
      });
    });


    // text for toggle theme text to be clickable
  document.addEventListener('DOMContentLoaded', function() {
    const toggleLabel = document.getElementById('themeToggle');
    const toggleText = document.getElementById('toggleText');

    // Add a click event listener to the text
    toggleText.addEventListener('click', function() {
      // Trigger the click event on the label
      toggleLabel.click();
    });
  });


  
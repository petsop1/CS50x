
// Changing the theme of the page.
function myFunction() {
  const myHtml = document.documentElement;
  const myBody = document.getElementById("myBody");

  // Toggle the theme
  const theme = myHtml.dataset.bsTheme == "light" ? "dark" : "light";
  myHtml.dataset.bsTheme = theme;
  myBody.dataset.bsTheme = theme;

  // Change the systemair logo in sidebar
  // Get the elements by their ids
  const g1Element = document.getElementById("g1element");
  const g2Element = document.getElementById("g2element");

  // Define the colors
  const originalColors = ["#002543", "#004985"];
  const replacementColor = "#FFFFFF";

  // Define the elements in an array
  const elements = [g1Element, g2Element];

  // Loop through each <path> element
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    if (myBody.dataset.bsTheme == "dark") {
      // Set the fill color to white
        element.setAttribute("fill", replacementColor);
      } else {
      // Switch back to the original color
        element.setAttribute("fill", originalColors[i]);
      }
  }

  // Save the theme preference to the database
  fetch('/save-theme', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ theme: theme }),
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch((error) => {
    console.error('Error:', error);
  });
}



  // Text for toggle theme text to be clickable
document.addEventListener('DOMContentLoaded', function() {
  const toggleLabel = document.getElementById('themeToggle');
  const toggleText = document.getElementById('toggleText');

  // Add a click event listener to the text
  toggleText.addEventListener('click', function() {
    // Trigger the click event on the label
    toggleLabel.click();
  });
});


// Logo icon - resizing the icon bars and changin its color
window.onload = function() {
  const outerContainer = document.querySelector('.outerContainer');
  const columns = document.querySelectorAll('.column');
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('font-size'));
  const originalHeights = Array.from(columns).map(column => column.offsetHeight / rootFontSize);
  const columnWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--column-width')) * rootFontSize;
  const columnMaxHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--column-max-height'))  * rootFontSize;
  const columnHoverIncrease = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--column-hover-increase'));

  outerContainer.onmousemove = function(event) {
    Array.from(columns).forEach((column, index) => {
      const rect = column.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const distanceFromCenter = Math.abs(event.clientX - centerX);
      const percentageFromCenter = Math.max(0, 1 - (distanceFromCenter / rect.width));
      const newHeight = originalHeights[index] * (1 + columnHoverIncrease / 100 * percentageFromCenter);
      column.style.height = newHeight + 'rem';
    });
  };

  outerContainer.onmouseleave = function() {
    Array.from(columns).forEach((column, index) => {
        column.style.height = originalHeights[index] + 'rem';
    });
  };

  // Find the maximum height of the columns in rem
  let maxColumnHeight = 0;
  columns.forEach(column => {
    const columnHeight = column.offsetHeight / rootFontSize;
    if (columnHeight > maxColumnHeight) {
      maxColumnHeight = columnHeight;
    }
  });

  // Calculate the height for the outerContainer in rem
  const outerContainerHeight = maxColumnHeight * (1 + columnHoverIncrease / 100);

  // Set the height of the outerContainer in rem
  outerContainer.style.height = outerContainerHeight + 'rem';
};


// Triggering the checkbox when clicking the text
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('toggleText').addEventListener('click', function() {
      document.getElementById('myCheckbox').click();
  });
});


// Fetch JOIN image from Unsplash API and much more

if (window.location.pathname == '/join') {

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner').classList.remove('d-none');
  });
  fetch('https://api.unsplash.com/photos/random?query=data+technology+statistics+probability&client_id=8HOLMjIRCEPobZlmj5sUoHi-HOq5Zeiuf0IOvB0f3jo')
  .then(response => response.json())
  .then(data => {
    let imageUrl = data.urls.full;

    // Create a new Image object
    let image = new Image();
    // Set the src of the Image object to the image URL
    image.src = imageUrl;
    // Add an onload event handler to the Image object
    image.onload = function() {
      // Set the background image when the image has loaded
      document.getElementById('joinBgPic').style.backgroundImage = `linear-gradient(rgba(17, 17, 17, 0.4), rgba(17, 17, 17, 0.3)), url(${imageUrl})`;


      // Get the date when the photo was last updated
      let updatedAt = new Date(data.updated_at);
      // Calculate the number of days since the photo was last updated
      let daysSinceUpdate = Math.floor((new Date() - updatedAt) / (1000 * 60 * 60 * 24));
      // Check if the photo was updated today
      let updateText = daysSinceUpdate === 0 ? 'today' : `${daysSinceUpdate} days ago`;

      // Get the name of the user who uploaded the photo
      let userName = data.user.name;

      // Get the location of the user who uploaded the photo
      let userLocation = data.user.location;
      let userLocationText = '';
      if (userLocation) {
        userLocationText = `from ${userLocation}`;
      }

      // Get the location where the photo was taken
      let photoLocationText = '';
      if (data.location.city && data.location.country) {
        photoLocationText = `photo taken in ${data.location.city}, ${data.location.country}`;
      }

      // Get the location where the photo was taken
      let photoDescription = '';
      if (data.description) {
        photoDescription = `, ${data.description}`;
      }

      // Select the <p> element by its id and set its text
      let p = document.querySelector('#photoInfo');
      p.textContent = `Updated ${updateText} by ${userName} ${userLocationText} ${photoLocationText} ${photoDescription}`;

      // Hide the spinner
      document.getElementById('spinner').classList.add('d-none');
    }
  })
  .catch(error => {
    // Generate a random number between 1 and 4
    let randomNumber = Math.floor(Math.random() * 4) + 1;
    // Append the random number to the base image name
    let imageName = 'login' + randomNumber;
    document.getElementById('joinBgPic').style.backgroundImage = `linear-gradient(rgba(17, 17, 17, 0.4), rgba(17, 17, 17, 0.3)), url('static/${imageName}.jpg')`;
    // If there's an error, hide the spinner
    document.getElementById('spinner').classList.add('d-none');
  });



  // Password validation
  function validate_password(password) {
    let messages = [];

    if (password.length < 8) {
      messages.push("Password should be at least 8 characters");
    }
    if (!/[a-z]/.test(password)) {
      messages.push("Password should contain at least one lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
      messages.push("Password should contain at least one uppercase letter");
    }
    if (!/[0-9]/.test(password)) {
      messages.push("Password should contain at least one digit");
    }

    return messages;
  }



  // Select the password input field and the element that will display the validation message
  const passwordInput = document.querySelector('#passwordField');
  const passwordValidationMessage = document.querySelector('#passwordValidationMessage');
  const passwordIcon = document.querySelector('#passwordIcon');
  // Define a variable to hold the timer
  let timer;
  let validationMessageTimer;


  // Add an event listener to the password input field
  passwordInput.addEventListener('input', function(event) {
    // Clear the previous timer
    clearTimeout(timer);
    // Clear the previous validation message timer
    clearTimeout(validationMessageTimer);

    // Get the password the user has typed
    const password = event.target.value;

    // Validate the password
    const messages = validate_password(password);

    // Update the validation message
    if (messages.length === 0) {
      passwordValidationMessage.textContent = 'Password is valid';
      passwordValidationMessage.style.color = 'green';
      passwordIcon.style.fill = 'green';

      // Clear the validation message after 4 seconds
      validationMessageTimer = setTimeout(function() {
        passwordValidationMessage.textContent = '';
      }, 4000);
    } else {
      passwordValidationMessage.innerHTML = messages.join('<br>');
      passwordValidationMessage.style.color = 'red';
      passwordIcon.style.fill = 'red';
    }
  });




  // Password eye icon
  function addEventListenerToPasswordIcon() {
    const passwordEyeIcon = document.getElementById('passwordEyeIcon');
    const passwordField = document.getElementById('passwordField');

    passwordEyeIcon.addEventListener('click', function (event) {
      if (passwordField.type === 'password') {
        passwordField.type = 'text';
        passwordEyeIcon.outerHTML = `
        <svg id="passwordEyeIcon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#adb5bd" class="bi bi-eye-fill position-absolute password-icon" viewBox="0 0 16 16">
          <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
          <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
        </svg>
        `;
        addEventListenerToPasswordIcon();
      } else {
        passwordField.type = 'password';
        passwordEyeIcon.outerHTML = `
        <svg id="passwordEyeIcon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#adb5bd" class="bi bi-eye-slash-fill position-absolute password-icon" viewBox="0 0 16 16">
          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
        </svg>
      `;
        addEventListenerToPasswordIcon();
      }
    });
}

addEventListenerToPasswordIcon();



// Password confirmation
// Select the confirmation password input field
const confirmPasswordInput = document.querySelector('#passwordConfirmationField');
const passwordConfirmationMessage = document.querySelector('#passwordConfirmationMessage');
const passwordConfirmationIcon = document.querySelector('#passwordConfirmationIcon');
let confirmationMessageTimer; // Define a variable to hold the timer

// Add an event listener to the confirmation password input field
confirmPasswordInput.addEventListener('input', function(event) {
  // Get the confirmation password the user has typed
  const confirmPassword = event.target.value;

  // Clear the previous confirmation message timer
  clearTimeout(confirmationMessageTimer);

  // Check if the password and the confirmation password match
  if (passwordInput.value == confirmPassword) {
    passwordConfirmationMessage.textContent = 'Passwords match';
    passwordConfirmationMessage.style.color = 'green';
    passwordConfirmationIcon.style.fill = 'green';

    // Clear the confirmation message after 4 seconds
    confirmationMessageTimer = setTimeout(function() {
      passwordConfirmationMessage.textContent = '';
    }, 4000);
  } else {
    passwordConfirmationMessage.textContent = 'Passwords do not match';
    passwordConfirmationMessage.style.color = 'red';
    passwordConfirmationIcon.style.fill = 'red';
  }
});

// So when someone types the confirm password first, the message will react
// Add an event listener to the password input field
passwordField.addEventListener('input', function(event) {

  // If the confirmation password input field is empty, do nothing
  if (confirmPasswordInput.value === '') {
    return;
  }

  // Clear the previous confirmation message timer
  clearTimeout(confirmationMessageTimer);

  // Check if the password and the confirmation password match
  if (passwordField.value == confirmPasswordInput.value) {
    passwordConfirmationMessage.textContent = 'Passwords match';
    passwordConfirmationMessage.style.color = 'green';
    passwordConfirmationIcon.style.fill = 'green';

    // Clear the confirmation message after 4 seconds
    confirmationMessageTimer = setTimeout(function() {
      passwordConfirmationMessage.textContent = '';
    }, 4000);
  } else {
    passwordConfirmationMessage.textContent = 'Passwords do not match';
    passwordConfirmationMessage.style.color = 'red';
    passwordConfirmationIcon.style.fill = 'red';
  }
});



// Confirmation Password eye icon
function addEventListenerToConfirmPasswordIcon() {
  const passwordConfirmationEyeIcon = document.getElementById('passwordConfirmationEyeIcon');

  passwordConfirmationEyeIcon.addEventListener('click', function (event) {
    if (confirmPasswordInput.type === 'password') {
      confirmPasswordInput.type = 'text';
      passwordConfirmationEyeIcon.outerHTML = `
      <svg id="passwordConfirmationEyeIcon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#adb5bd" class="bi bi-eye-fill position-absolute password-icon" viewBox="0 0 16 16">
        <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
        <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
      </svg>
    `;
      addEventListenerToConfirmPasswordIcon();
    } else {
      confirmPasswordInput.type = 'password';
      passwordConfirmationEyeIcon.outerHTML = `
      <svg id="passwordConfirmationEyeIcon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#adb5bd" class="bi bi-eye-slash-fill position-absolute password-icon" viewBox="0 0 16 16">
        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
      </svg>
    `;
      addEventListenerToConfirmPasswordIcon();
    }
  });
}
addEventListenerToConfirmPasswordIcon();
}


// Fetch ERROR image from Unsplash API
if (window.location.pathname == '/apology') {
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner').classList.remove('d-none');
  });

  fetch('https://api.unsplash.com/photos/random?query=horror+creapy&client_id=8HOLMjIRCEPobZlmj5sUoHi-HOq5Zeiuf0IOvB0f3jo')
  .then(response => response.json())
  .then(data => {
    let imageUrl = data.urls.full;

    // Create a new Image object
    let image = new Image();
    // Set the src of the Image object to the image URL
    image.src = imageUrl;
    // Add an onload event handler to the Image object
    image.onload = function() {
      // Set the background image when the image has loaded
      document.getElementById('errorBgPic').style.backgroundImage = `linear-gradient(rgba(17, 17, 17, 0.7), rgba(17, 17, 17, 0.8)), url(${imageUrl})`;


      // Get the date when the photo was last updated
      let updatedAt = new Date(data.updated_at);
      // Calculate the number of days since the photo was last updated
      let daysSinceUpdate = Math.floor((new Date() - updatedAt) / (1000 * 60 * 60 * 24));
      // Check if the photo was updated today
      let updateText = daysSinceUpdate === 0 ? 'today' : `${daysSinceUpdate} days ago`;

      // Get the name of the user who uploaded the photo
      let userName = data.user.name;

      // Get the location of the user who uploaded the photo
      let userLocation = data.user.location;
      let userLocationText = '';
      if (userLocation) {
        userLocationText = `from ${userLocation}`;
      }

      // Get the location where the photo was taken
      let photoLocationText = '';
      if (data.location.city && data.location.country) {
        photoLocationText = `photo taken in ${data.location.city}, ${data.location.country}`;
      }

      // Get the location where the photo was taken
      let photoDescription = '';
      if (data.description) {
        photoDescription = `, ${data.description}`;
      }

      // Select the <p> element by its id and set its text
      let p = document.querySelector('#photoInfo');
      p.textContent = `Updated ${updateText} by ${userName} ${userLocationText} ${photoLocationText} ${photoDescription}`;

      // Hide the spinner
      document.getElementById('spinner').classList.add('d-none');
    }
  })
  .catch(error => {
    // Generate a random number between 1 and 4
    let randomNumber = Math.floor(Math.random() * 4) + 1;
    // Append the random number to the base image name
    let imageName = 'error' + randomNumber;
    document.getElementById('errorBgPic').style.backgroundImage = `linear-gradient(rgba(17, 17, 17, 0.6), rgba(17, 17, 17, 0.7)), url('static/${imageName}.jpg')`;
    // If there's an error, hide the spinner
    document.getElementById('spinner').classList.add('d-none');
  });


  let pos = document.documentElement;
  pos.addEventListener('mousemove', e =>{
      pos.style.setProperty('--x', e.clientX + 'px');
      pos.style.setProperty('--y', e.clientY + 'px');
  })

  function applyAnimation(text, chars) {
    let animateCount = chars.length < 7 ? 1 : Math.max(1, Math.floor(Math.random() * 2) + 1);
    let animateIndices = [];

    while (animateIndices.length < animateCount) {
      let randomIndex = Math.floor(Math.random() * chars.length);
      if (!animateIndices.includes(randomIndex)) {
          animateIndices.push(randomIndex);
      }
    }

    // Remove all existing span elements
    while (text.firstChild) {
      text.removeChild(text.firstChild);
    }

    chars.forEach((char, i) => {
      let span = text.children[i] || document.createElement('span');
      span.textContent = char;

      // Apply a random animation to a random character
      if (animateIndices.includes(i)) {
          let animationName = Math.random() > 0.5 ? 'fastFlash' : 'slowFlash';
          let duration = animationName === 'slowFlash' ? 1 + Math.random() : 0.5 + Math.random();
          span.style.animation = `${animationName} ${duration}s infinite`;
      }

      text.appendChild(span);
    });
  }



  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
      let text = document.querySelector('.glowing');
      let chars = text.textContent.split('');
      text.innerHTML = '';

      applyAnimation(text, chars);
    }, 500);
  });
}





// Eye icon @ login route
if (window.location.pathname == '/login') {
  // Password eye icon
  function addEventListenerToEyeLoginIcon() {
    const passwordEyeLoginIcon = document.getElementById('passwordEyeLoginIcon');
    const passwordLoginField = document.getElementById('passwordLoginField');

    passwordEyeLoginIcon.addEventListener('click', function (event) {
      if (passwordLoginField.type === 'password') {
        passwordLoginField.type = 'text';
        passwordEyeLoginIcon.outerHTML = `
        <svg id="passwordEyeLoginIcon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#adb5bd" class="bi bi-eye-slash-fill position-absolute password-icon" viewBox="0 0 16 16">
          <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
          <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
          </svg>
          `;
          addEventListenerToEyeLoginIcon();
        } else {
          passwordLoginField.type = 'password';
          passwordEyeLoginIcon.outerHTML = `
          <svg id="passwordEyeLoginIcon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#adb5bd" class="bi bi-eye-fill position-absolute password-icon" viewBox="0 0 16 16">
          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
        </svg>
      `;
        addEventListenerToEyeLoginIcon();
      }
    });
  }
  addEventListenerToEyeLoginIcon();
}


// JS for the Privacy Policy page - simple SNAKE game
if (window.location.pathname == '/privacy') {

  const canvas = document.getElementById('game');
  const context = canvas.getContext('2d');

  const box = 20;
  const canvasSize = 20;
  let score = 0;
  let snake = [];
  snake[0] = { x: canvasSize / 2 * box, y: canvasSize / 2 * box };

  let food = {
    x: Math.floor(Math.random() * canvasSize) * box,
    y: Math.floor(Math.random() * canvasSize) * box,
  };

  let d;

  document.addEventListener('keydown', direction);

  function direction(event) {
    if (event.keyCode === 37 && d !== 'RIGHT') {
      d = 'LEFT';
    } else if (event.keyCode === 38 && d !== 'DOWN') {
      d = 'UP';
    } else if (event.keyCode === 39 && d !== 'LEFT') {
      d = 'RIGHT';
    } else if (event.keyCode === 40 && d !== 'UP') {
      d = 'DOWN';
    }
  }

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.length; i++) {
      context.fillStyle = i === 0 ? 'green' : 'white';
      context.fillRect(snake[i].x, snake[i].y, box, box);

      context.strokeStyle = 'red';
      context.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    context.fillStyle = 'orange';
    context.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
      score++;
      food = {
        x: Math.floor(Math.random() * canvasSize) * box,
        y: Math.floor(Math.random() * canvasSize) * box,
      };
    } else {
      snake.pop();
    }

    let newHead = {
      x: snakeX,
      y: snakeY,
    };

    if (
      snakeX < 0 ||
      snakeY < 0 ||
      snakeX >= canvasSize * box ||
      snakeY >= canvasSize * box ||
      collision(newHead, snake)
    ) {
      clearInterval(game);
    }

    snake.unshift(newHead);

    context.fillStyle = 'white';
    context.font = '45px Changa one';
    context.fillText(score, 2 * box, 1.6 * box);
  }

  function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
      if (head.x === array[i].x && head.y === array[i].y) {
        return true;
      }
    }
    return false;
  }

  let game = setInterval(draw, 100);
}


// Fetch password image from Unsplash API and much more
if (window.location.pathname == '/password') {

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('spinner2').style.display = 'block';
    document.getElementById('spinner2').classList.remove('d-none');
  });
  fetch('https://api.unsplash.com/photos/random?query=password&client_id=8HOLMjIRCEPobZlmj5sUoHi-HOq5Zeiuf0IOvB0f3jo')
  .then(response => response.json())
  .then(data => {
    let imageUrl = data.urls.full;

    // Create a new Image object
    let image = new Image();
    // Set the src of the Image object to the image URL
    image.src = imageUrl;
    // Add an onload event handler to the Image object
    image.onload = function() {
      // Set the background image when the image has loaded
      document.getElementById('passwordBgPic').style.backgroundImage = `linear-gradient(rgba(17, 17, 17, 0.4), rgba(17, 17, 17, 0.3)), url(${imageUrl})`;


      // Get the date when the photo was last updated
      let updatedAt = new Date(data.updated_at);
      // Calculate the number of days since the photo was last updated
      let daysSinceUpdate = Math.floor((new Date() - updatedAt) / (1000 * 60 * 60 * 24));
      // Check if the photo was updated today
      let updateText = daysSinceUpdate === 0 ? 'today' : `${daysSinceUpdate} days ago`;

      // Get the name of the user who uploaded the photo
      let userName = data.user.name;

      // Get the location of the user who uploaded the photo
      let userLocation = data.user.location;
      let userLocationText = '';
      if (userLocation) {
        userLocationText = `from ${userLocation}`;
      }

      // Get the location where the photo was taken
      let photoLocationText = '';
      if (data.location.city && data.location.country) {
        photoLocationText = `photo taken in ${data.location.city}, ${data.location.country}`;
      }

      // Get the location where the photo was taken
      let photoDescription = '';
      if (data.description) {
        photoDescription = `, ${data.description}`;
      }

      // Select the <p> element by its id and set its text
      let p = document.querySelector('#photoInfo2');
      p.textContent = `Updated ${updateText} by ${userName} ${userLocationText} ${photoLocationText} ${photoDescription}`;

      // Hide the spinner
      document.getElementById('spinner2').classList.add('d-none');
    }
  })
  .catch(error => {
    // Generate a random number between 1 and 4
    let randomNumber = Math.floor(Math.random() * 4) + 1;
    // Append the random number to the base image name
    let imageName = 'login' + randomNumber;
    document.getElementById('passwordBgPic').style.backgroundImage = `linear-gradient(rgba(17, 17, 17, 0.4), rgba(17, 17, 17, 0.3)), url('static/${imageName}.jpg')`;
    // If there's an error, hide the spinner
    document.getElementById('spinner2').classList.add('d-none');
  });


  // Password validation
  function validate_password(password) {
    let messages = [];

    if (password.length < 8) {
      messages.push("Password should be at least 8 characters");
    }
    if (!/[a-z]/.test(password)) {
      messages.push("Password should contain at least one lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
      messages.push("Password should contain at least one uppercase letter");
    }
    if (!/[0-9]/.test(password)) {
      messages.push("Password should contain at least one digit");
    }

    return messages;
  }



  // Select the password input field and the element that will display the validation message
  const passwordInput = document.querySelector('#password_new1');
  const passwordValidationMessage = document.querySelector('#passwordValidationMessage2');
  const passwordIcon = document.querySelector('#passwordIcon_new1');
  // Define a variable to hold the timer
  let timer;
  let validationMessageTimer;


  // Add an event listener to the password input field
  passwordInput.addEventListener('input', function(event) {
    // Clear the previous timer
    clearTimeout(timer);
    // Clear the previous validation message timer
    clearTimeout(validationMessageTimer);

    // Get the password the user has typed
    const password = event.target.value;

    // Validate the password
    const messages = validate_password(password);

    // Update the validation message
    if (messages.length === 0) {
      passwordValidationMessage.textContent = 'Password is valid';
      passwordValidationMessage.style.color = 'green';
      passwordIcon.style.fill = 'green';

      // Clear the validation message after 4 seconds
      validationMessageTimer = setTimeout(function() {
        passwordValidationMessage.textContent = '';
      }, 4000);
    } else {
      passwordValidationMessage.innerHTML = messages.join('<br>');
      passwordValidationMessage.style.color = 'red';
      passwordIcon.style.fill = 'red';
    }
  });


  // Password eye icon
  function addEventListenerToPasswordIcon() {
    const passwordEyeIcon = document.getElementById('passwordEyeIcon_new1');
    const passwordField = document.getElementById('password_new1');

    passwordEyeIcon.addEventListener('click', function (event) {
      if (passwordField.type === 'password') {
        passwordField.type = 'text';
        passwordEyeIcon.outerHTML = `
        <svg id="passwordEyeIcon_new1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#adb5bd" class="bi bi-eye-fill position-absolute password-icon" viewBox="0 0 16 16">
          <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
          <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
        </svg>
        `;
        addEventListenerToPasswordIcon();
      } else {
        passwordField.type = 'password';
        passwordEyeIcon.outerHTML = `
        <svg id="passwordEyeIcon_new1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#adb5bd" class="bi bi-eye-slash-fill position-absolute password-icon" viewBox="0 0 16 16">
          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
        </svg>
      `;
        addEventListenerToPasswordIcon();
      }
    });
}

addEventListenerToPasswordIcon();




// Password confirmation
// Select the confirmation password input field
const confirmPasswordInput = document.querySelector('#password_new2');
const passwordConfirmationMessage = document.querySelector('#passwordConfirmationMessage');
const passwordConfirmationIcon = document.querySelector('#passwordIcon_new2');
let confirmationMessageTimer; // Define a variable to hold the timer

// Add an event listener to the confirmation password input field
confirmPasswordInput.addEventListener('input', function(event) {
  // Get the confirmation password the user has typed
  const confirmPassword = event.target.value;

  // Clear the previous confirmation message timer
  clearTimeout(confirmationMessageTimer);

  // Check if the password and the confirmation password match
  if (passwordInput.value == confirmPassword) {
    passwordConfirmationMessage.textContent = 'Passwords match';
    passwordConfirmationMessage.style.color = 'green';
    passwordConfirmationIcon.style.fill = 'green';

    // Clear the confirmation message after 4 seconds
    confirmationMessageTimer = setTimeout(function() {
      passwordConfirmationMessage.textContent = '';
    }, 4000);
  } else {
    passwordConfirmationMessage.textContent = 'Passwords do not match';
    passwordConfirmationMessage.style.color = 'red';
    passwordConfirmationIcon.style.fill = 'red';
  }
});

// So when someone types the confirm password first, the message will react
// Add an event listener to the password input field
const passwordField = document.getElementById('password_new1');
passwordField.addEventListener('input', function(event) {

  // If the confirmation password input field is empty, do nothing
  if (confirmPasswordInput.value === '') {
    return;
  }

  // Clear the previous confirmation message timer
  clearTimeout(confirmationMessageTimer);

  // Check if the password and the confirmation password match
  if (passwordField.value == confirmPasswordInput.value) {
    passwordConfirmationMessage.textContent = 'Passwords match';
    passwordConfirmationMessage.style.color = 'green';
    passwordConfirmationIcon.style.fill = 'green';

    // Clear the confirmation message after 4 seconds
    confirmationMessageTimer = setTimeout(function() {
      passwordConfirmationMessage.textContent = '';
    }, 4000);
  } else {
    passwordConfirmationMessage.textContent = 'Passwords do not match';
    passwordConfirmationMessage.style.color = 'red';
    passwordConfirmationIcon.style.fill = 'red';
  }
});



// Confirmation Password eye icon
function addEventListenerToConfirmPasswordIcon() {
  const passwordConfirmationEyeIcon = document.getElementById('passwordEyeIcon_new2');

  passwordConfirmationEyeIcon.addEventListener('click', function (event) {
    if (confirmPasswordInput.type === 'password') {
      confirmPasswordInput.type = 'text';
      passwordConfirmationEyeIcon.outerHTML = `
      <svg id="passwordEyeIcon_new2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#adb5bd" class="bi bi-eye-fill position-absolute password-icon" viewBox="0 0 16 16">
        <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
        <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
      </svg>
    `;
      addEventListenerToConfirmPasswordIcon();
    } else {
      confirmPasswordInput.type = 'password';
      passwordConfirmationEyeIcon.outerHTML = `
      <svg id="passwordEyeIcon_new2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#adb5bd" class="bi bi-eye-slash-fill position-absolute password-icon" viewBox="0 0 16 16">
        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
      </svg>
    `;
      addEventListenerToConfirmPasswordIcon();
    }
  });
}
addEventListenerToConfirmPasswordIcon();



// Confirmation Password eye icon
function addEventListenerToOldPassword() {
  const passwordConfirmationEyeIcon = document.getElementById('passwordEyeIcon_old');
  const confirmPasswordInput = document.getElementById('password_old');


  passwordConfirmationEyeIcon.addEventListener('click', function (event) {
    if (confirmPasswordInput.type === 'password') {
      confirmPasswordInput.type = 'text';
      passwordConfirmationEyeIcon.outerHTML = `
      <svg id="passwordEyeIcon_old" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#adb5bd" class="bi bi-eye-fill position-absolute password-icon" viewBox="0 0 16 16">
        <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
        <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
      </svg>
    `;
    addEventListenerToOldPassword();
    } else {
      confirmPasswordInput.type = 'password';
      passwordConfirmationEyeIcon.outerHTML = `
      <svg id="passwordEyeIcon_old" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#adb5bd" class="bi bi-eye-slash-fill position-absolute password-icon" viewBox="0 0 16 16">
        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
      </svg>
    `;
    addEventListenerToOldPassword();
    }
  });
}
addEventListenerToOldPassword();
}














// DRAG and DROPING!!!!

// Testing and playing with Tabulator library!!!!
//define data array
const tabledata = [
  {id:1, t1:"21,35", t2:"61,35", hum:"45,26", atm:191328, dp:"25,83", veab:"150,23", ps1:"65,23", ps2:"122,92", progress:12},
  {id:2, t1:"21,34", t2:"61,34", hum:"45,28", atm:191327, dp:"31,69", veab:"155,41", ps1:"61,68", ps2:"124,22", progress:1},
  {id:3, t1:"21,36", t2:"61,36", hum:"45,29", atm:191329, dp:"34,91", veab:"159,88", ps1:"64,21", ps2:"124,18", progress:42},
  {id:4, t1:"21,39", t2:"61,39", hum:"45,25", atm:191321, dp:"39,25", veab:"162,17", ps1:"69,28", ps2:"128,23", progress:100},
  {id:5, t1:"21,33", t2:"61,33", hum:"45,24", atm:191325, dp:"44,15", veab:"165,91", ps1:"64,32", ps2:"126,25", progress:16},
  {id:6, t1:"21,30", t2:"61,30", hum:"45,22", atm:191326, dp:"51,24", veab:"168,63", ps1:"61,19", ps2:"122,81", progress:38},
];

//create Tabulator on DOM element with id "example-table"
const table = new Tabulator("#example-table", {
  data:tabledata,           //load row data from array
  height:"auto",            // Set height to auto
  layout:"fitColumns",         //resize the tables columns to fit the data held in each column, unless you specify a width or minWidth
  movableColumns:false,      //allow column order to be changed (true) or not (false)

  selectableRange:1,
  selectableRangeColumns:true,
  selectableRangeRows:true,

  //configure clipboard to allow copy and paste of range format data
  clipboard:"copy",
  clipboardCopyRowRange:"range",
  clipboardCopyStyled:false,
  clipboardCopyConfig:{
      rowHeaders:true,
      columnHeaders:true,
      formatCells:false,
  },

  columnDefaults:{
    tooltip:true,         //show tool tips on cells
    headerSort:false
  },

  //define the table columns
  columnHeaderVertAlign:"bottom",
  columns:[
    {title: "<div class='d-flex justify-content-between'>" +
              "<h4 class='mb-0'>Data table</h4>" +
              "<div>" +
              "<svg id='copy-table' class='interactive-svg me-2' xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-clipboard' viewBox='0 0 16 16'>" +
              "<path d='M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z'/>" +
              "<path d='M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z'/>" +
              "</svg>" +
              "<svg id='copy-selected' class='interactive-svg' xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-clipboard-check' viewBox='0 0 16 16'>" +
              "<path fill-rule='evenodd' d='M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0'/>" +
              "<path d='M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z'/>" +
              "<path d='M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z'/>" +
              "</svg>" +
              "</div>" +
            "</div>",
      columns:[
        {
          title:"Id",
          field:"id",
          headerSort:false,
          width:45,
          resizable:false,
          // frozen:true,  cant be frozen when group column is applied
          clipboard:true,
          cellClick:function(e, cell){
            var row = cell.getRow();
            if(row.isSelected()){
              row.deselect();
            } else {
              row.select();
            }
          },
        },
        {title:"<div id='t11'><i>t</i> (°C)</div>", field:"t1", minWidth:50},
        {title:"<div id='header2'>RH (%)</div>", field:"hum", minWidth:65},
        {title:"<i>p</i><sub>atm</sub> (Pa)", field:"atm", width:100},
        {title:"d<i>p</i> (Pa)", field:"dp", minWidth:65},
        {title:"VEAB 50 (m<sup>3</sup>/h)", field:"veab", minWidth:115},
        {title:"<i>p</i><sub>s1</sub> (Pa)", field:"ps1", minWidth:65},
        {title:"<i>p</i><sub>s2</sub> (Pa)", field:"ps2", minWidth:65},
        {title:"Diagram", field:"progress", minWidth:95, hozAlign:"left", formatter:"progress", editor:true},
      ],
    },
  ],
});





// Function to add event listeners to the buttons for a specific table
function addTableEventListeners(table, tableId) {
  const copyTypes = ['all', 'selected']

  copyTypes.forEach(function(copyType) {
    // var copyTableButton = document.getElementById('copy-all-' + tableId);
    let button = document.getElementById('copy-' + copyType + '-' + tableId);
    if (button) {
      button.addEventListener('click', function(event){
      table.copyToClipboard(copyType);

      // Add 'clicked' class to the button
      button.classList.add('clicked');

      // Change color to green after flash animation
      setTimeout(() => {
        let paths = event.target.querySelectorAll('path');
        paths.forEach(path => path.setAttributeNS(null, 'fill', '#28a745')); // Change color to green

        // Change color back to original after 5 seconds
        setTimeout(() => {
          paths.forEach(path => path.setAttributeNS(null, 'fill', '')); // Change color back to original
          event.target.classList.remove('clicked');
        }, 5000); // Change color back after 5 seconds
      }, 400); // Change color after flash animation

      });
    }
  });
}



function addAnimationToTableName(tableId) {
  let tableElement = document.querySelector('#' + tableId);

  tableElement.addEventListener('mouseover', function(event) {
    if (event.target.tagName.toLowerCase() === 'h4') {
      anime({
        targets: event.target, color: ['#000', '#007bff'], // Change color from black to blue
        duration: 3000, direction: 'alternate', loop: true, easing: 'easeInOutSine'
      });
    }
  });
  tableElement.addEventListener('mouseout', function(event) {
    if (event.target.tagName.toLowerCase() === 'h4') {
      anime.remove(event.target); // Stop the animation
      event.target.style.color = '#000'; // Reset color
    }
  });
}





// Function for generating full one column tables on drop event,
function createTable(tableId, title, field, tableCounter, newId) {
  let table = new Tabulator("#" + tableId, {
    data:tabledata,           //load row data from array
    height:"auto",            // Set height to auto
    layout:"fitColumns",         //resize the tables columns to fit the data held in each column, unless you specify a width or minWidth
    movableColumns:false,      //allow column order to be changed (true) or not (false)

    selectableRange:1,
    selectableRangeColumns:true,
    selectableRangeRows:true,

    //configure clipboard to allow copy and paste of range format data
    clipboard:"copy",
    clipboardCopyRowRange:"range",
    clipboardCopyStyled:false,
    clipboardCopyConfig:{
        rowHeaders:true,
        columnHeaders:true,
        formatCells:false,
    },

    columnDefaults:{
      tooltip:true,         //show tool tips on cells
      headerSort:false
    },

    //define the table columns
    columnHeaderVertAlign:"bottom",
    columns:[
            //     {title: "Table " + tableCounter, // This is the group header
      //       columns:[
      //         {title:`<div id="${newId}" class="draggable" element-inside="main">${event.relatedTarget.innerHTML} ${unit}</div>`,
      //         field:event.relatedTarget.id,
      // this is where i finished and i need to find out what commented code does and adapt if needed, this somewhere here needs to be done adding the dragable function as well the hole div with element-inside main

      {title: "<div class='d-flex justify-content-between'>" +
        "<h4 class='mb-0 me-5'> Table " + tableCounter + "</h4>" +
        "<div>" +
        "<svg id='copy-all-table-" + tableCounter + "' class='interactive-svg me-2' xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-clipboard' viewBox='0 0 16 16'>" +
        "<path d='M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z'/>" +
        "<path d='M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z'/>" +
        "</svg>" +
        "<svg id='copy-selected-table-" + tableCounter + "' class='interactive-svg' xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-clipboard-check' viewBox='0 0 16 16'>" +
        "<path fill-rule='evenodd' d='M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0'/>" +
        "<path d='M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z'/>" +
        "<path d='M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z'/>" +
        "</svg>" +
        "</div>" +
      "</div>",
        columns:[
          {
            title:"Id",
            field:"id",
            headerSort:false,
            width:45,
            resizable:false,
            // frozen:true,  cant be frozen when group column is applied
            clipboard:true,
            cellClick:function(e, cell){
              let row = cell.getRow();
              if(row.isSelected()){
                row.deselect();
              } else {
                row.select();
              }
            },
          },
          {
            title: `<div id="${newId}" class="draggable" element-inside="main">${title}</div>`,
            field: field,
            minWidth:50
          },
        ],
      },
    ],
  });

  // Add the new Tabulator instance to the tables dictionary
  tables[tableId] = table;

  return table;
}







function makeTableDraggable(id) {
  // Make the h4 tag  draggable
  interact(id)
    .draggable({
      inertia: true,
      // Keep the element within the area of it's parent
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: function() {
            var parent = document.querySelector(id).parentNode;
            var parentRect = parent.getBoundingClientRect();
            return {left: parentRect.left, top: parentRect.top, right: Infinity, bottom: Infinity};
          },
          endOnly: true
        })
      ],
      // Enable autoScroll
      autoScroll: true,
      // Only allow drag actions to start when the h4 element is grabbed
      allowFrom: id + " h4",
      // Call this function on every dragmove event
      onmove: function (event) {
        let target = event.target;
        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        // console.log("targett", target);
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      }
    });
}

makeTableDraggable('#example-table');





function dragMoveListener (event) {
  let target = draggedElement;
  let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
}





let draggedElement = null;
// Loop over the table and make each item draggable
interact('.draggable[element-inside="sidebar"]').draggable({
  // Draggable options...
  inertia: true,
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: '.main',
      endOnly: false
    })
  ],
  autoScroll: true,

  listeners: {
    start: function (event) {
      // Clone the target and append it to the body
      let clone = event.target.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.left = event.clientX + 'px';
      clone.style.top = event.clientY + 'px';

      document.body.appendChild(clone);
      draggedElement = clone;
      event.interactable.targetChecker = function (pointer, interactable, element, interacting) {
        return interacting && element === draggedElement;
      };

      // event.target.setAttribute('element-inside', 'sidebar');

      // Calculate the distance from the cursor to the element's top-left corner
      let rect = event.target.getBoundingClientRect();
      let offsetX = event.clientX - rect.left;
      let offsetY = event.clientY - rect.top;
    },

    move: dragMoveListener,

    end: function (event) {
      anime({
        targets: draggedElement,
        scale: 0,
        opacity: 0,
        duration: 800,
        easing: 'easeInOutQuad',
        complete: function() {
          if (draggedElement && draggedElement.parentNode && draggedElement.parentNode.contains(draggedElement)) {
            draggedElement.parentNode.removeChild(draggedElement);
          }
        }
      });
    }
  }
});







// Loop over the table and make each item draggable
interact('.draggable[element-inside="main"]').draggable({
  // Draggable options...
  inertia: true,
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: '.sidebar',
      endOnly: false
    })
  ],
  autoScroll: true,

  listeners: {
    start: function (event) {
      // Clone the target and append it to the body
      let clone = event.target.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.left = event.clientX + 'px';
      clone.style.top = event.clientY + 'px';

      document.body.appendChild(clone);
      draggedElement = clone;
      event.interactable.targetChecker = function (pointer, interactable, element, interacting) {
        return interacting && element === draggedElement;
      };

      // Calculate the distance from the cursor to the element's top-left corner
      let rect = event.target.getBoundingClientRect();
      let offsetX = event.clientX - rect.left;
      let offsetY = event.clientY - rect.top;
      draggedElement.classList.add('btn','btn-outline-primary', 'temp-sensor', 'py-0');
    },

    move: dragMoveListener,

    end: function (event) {
      // remove the draged clone at the and of the drag event, when released
      anime({
        targets: draggedElement,
        scale: 0,
        opacity: 0,
        duration: 1000,
        easing: 'easeInOutQuad',
        complete: function() {
          if (draggedElement && draggedElement.parentNode && draggedElement.parentNode.contains(draggedElement)) {
            draggedElement.parentNode.removeChild(draggedElement);
          }
        }
      });
    }
  }
});



let usedIds = [];
function getNewId(event) {
  let baseId = event.relatedTarget.id;
  let counter = 1;
  let newId = baseId + '-' + counter;
  while (usedIds.includes(newId)) {
    counter++;
    newId = baseId + '-' + counter;
  }
  usedIds.push(newId);
  return newId;
}


// Remove unit class that hides unit in sidebar, so unit is visible in the table
function removeUnitClass(htmlString) {
  let tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  let unitElement = tempDiv.querySelector('.unit');
  if (unitElement) {
    unitElement.removeAttribute('class');
  }
  return tempDiv.innerHTML;
}





let tableCounter = 0;
let tables = {};
interact('.main').dropzone({
  accept: '.draggable[element-inside="sidebar"]',

  ondropactivate: function (event) {
    // add active dropzone feedback
    event.target.classList.add('drop-active')
  },

  ondragenter: function (event) {
    // feedback the possibility of a drop
    event.target.classList.add('drop-target')
    draggedElement.classList.replace('btn-outline-primary', 'btn-outline-success');
  },

  ondragleave: function (event) {
    // remove the drop feedback style
    event.target.classList.remove('drop-target')
    draggedElement.classList.replace('btn-outline-success', 'btn-outline-primary');
  },

  ondrop: function (event) {
    // If the item was dragged from the sidebar
    // Increment the table counter and generate a unique id for the new table
    tableCounter++;
    let newDiv = document.createElement("div");
    let newTableId = 'table-' + tableCounter;

    let title = removeUnitClass(event.relatedTarget.innerHTML);
    let newId = getNewId(event);

    newDiv.id = newTableId;
    event.target.appendChild(newDiv);
    newDiv.style.position = 'absolute';
    newDiv.style.left = event.dragEvent.pageX - event.target.offsetLeft + 'px';
    newDiv.style.top = event.dragEvent.pageY - event.target.offsetTop + 'px';
    newDiv.tabulator = createTable(newTableId, title, event.relatedTarget.id, tableCounter, newId);

    // When a table is built, add the event listeners
    newDiv.tabulator.on("tableBuilt", function() {
      addTableEventListeners(this, newTableId);
      addAnimationToTableName(newTableId);
    });

    // Generate a new id for the item
    makeTableDraggable("#" + newDiv.id)

    if (event.relatedTarget.getAttribute('element-inside') === 'main') {
      // Update the element-inside attribute
      event.relatedTarget.setAttribute('element-inside', 'main');
    }
  },

  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active')
    event.target.classList.remove('drop-target')
  }
});





// Add the delete drop event handler to the sidebar
interact('.sidebar').dropzone({
  accept: '.draggable[element-inside="main"]',
  // overlap: 0.75,

  ondropactivate: function (event) {
    // add active dropzone feedback
    event.target.classList.add('drop-active-delete')
  },

  ondragenter: function (event) {
    // feedback the possibility of a drop
    event.target.classList.add('drop-target-delete')
    draggedElement.classList.replace('btn-outline-primary', 'btn-outline-danger');
  },

  ondragleave: function (event) {
    // remove the drop feedback style
    event.target.classList.remove('drop-target-delete')
    draggedElement.classList.replace('btn-outline-danger', 'btn-outline-primary');
  },

  ondrop: function (event) {
    // Get the tableInstance of the dragged element
    let tableInstance = tables[event.relatedTarget.closest('.tabulator').id];
    let allColumns = tableInstance.getColumns();
    let totalColumns = allColumns.length;

    // If it is only column, delete the whole table
    if (tableInstance && totalColumns <= 2) {
      tableInstance.destroy();
    } else {
      // If there are more columns in table, delete based on the order index in array
      let columnElement = event.relatedTarget;
      let id = columnElement ? columnElement.id : null;

      // Get the columnIndex of the column with the given id
      let columnIndex;
      allColumns.forEach((col, index) => {
        let draggableDiv = col.getElement().querySelector('.draggable');
        if (draggableDiv && draggableDiv.id === id) {
          columnIndex = index;
        }
      });
      // Delete the column using splice and update the column definitions in the tableInstance object
      let currentColumns = tableInstance.getColumns(true);
      let currentColumnDefinitions = currentColumns.map(column => column.getDefinition());
      // !!!!!!!!  its fixed zero index, when multiple group headers are used, this needs to be updated!!!!!!!
      let groupColumnDefinition = currentColumnDefinitions[0];
      groupColumnDefinition.columns.splice(columnIndex, 1);
      tableInstance.setColumns(currentColumnDefinitions);
    }
  },

  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active-delete')
    event.target.classList.remove('drop-target-delete')
  }
});













function findClosestGroupHeaderIndex(columns, droppedElement) {
  let closestHeaderIndex = -1;
  for (let i = 0; i < columns.length; i++) {
    if (columns[i] === droppedElement) {
      return closestHeaderIndex;
    }
    closestHeaderIndex = i;
  }
  // If no header comes after the dropped element, return the last index
  return closestHeaderIndex;
}


// Add the drop event handler to the column headers
interact('.tabulator-col').dropzone({
  accept: '.draggable',

  ondragenter: function (event) {
    let columnElement = event.target;
    if (columnElement.getAttribute('role') === 'columnheader') {
      columnElement.classList.add('tabulator-range-highlight-alt');

      // Create a triangle element
      let triangle = document.createElement('div');
      triangle.id = 'drop-indicator';
      // Append the triangle to the body
      document.body.appendChild(triangle);
      // Position the triangle above the column header
      let rect = columnElement.getBoundingClientRect();
      triangle.style.left = rect.right - 5 + 'px';
      triangle.style.top = rect.top - 5 + 'px'; // Position it 10px above the column header
    }
  },

  ondragleave: function (event) {
    let columnElement = event.target;
    if (columnElement.getAttribute('role') === 'columnheader') {
      columnElement.classList.remove('tabulator-range-highlight-alt');

      // Remove the triangle from the body
      let triangle = document.getElementById('drop-indicator');
      if (triangle) {
        document.body.removeChild(triangle);
      }
    }
  },

  ondrop: function (event) {
    // console.log("im in the ondrop for the columns headers");
    let columnElement = event.target;
    let tableInstance = tables[event.target.closest('.tabulator').id];
    let draggableDiv = columnElement.querySelector('.draggable');
    let id = draggableDiv ? draggableDiv.id : null;

    // Get the index of the column, id doesnt have draggable class so thats way when not find i set it to 0 hence i expect it was dropped on the first column
    let columnIndex;
    let allColumns = tableInstance.getColumns();
    if (draggableDiv) {
      columnIndex = allColumns.findIndex(col => {
        let draggableDiv = col.getElement().querySelector('.draggable');
        // Return true if the id of the draggable div matches the id we are looking for and columnIndex is with correct value
        return draggableDiv && draggableDiv.id === id;
      });
      columnIndex = columnIndex === -1 ? 0 : columnIndex;
    } else {
      columnIndex = 0;
    }

    // Get the closestHeader from closestHeaderIndex
    let closestHeaderIndex = findClosestGroupHeaderIndex(tableInstance.options.columns, event.target);
    let closestHeader = tableInstance.options.columns[closestHeaderIndex];
    let newId = getNewId(event);

    // Remove unit class that hides unit in sidebar, so unit is visible in the table
    let title = removeUnitClass(event.relatedTarget.innerHTML);

    // Define the new column
    let newColumn = {
      title: `<div id="${newId}" class="draggable" element-inside="main">${title}</div>`,
      field: event.relatedTarget.id,
    };

    // Insert the new column after the closest column and update table columns
    closestHeader.columns.splice(columnIndex + 1, 0, newColumn);
    let currentColumns = tableInstance.getColumns(true);
    let currentColumnDefinitions = currentColumns.map(column => column.getDefinition());
    tableInstance.setColumns(currentColumnDefinitions);

    // Remove the triangle from the body and visual feedback from the column header
    columnElement.classList.remove('tabulator-range-highlight-alt');
    let triangle = document.getElementById('drop-indicator');
    if (triangle) {
      document.body.removeChild(triangle);
    }
  }
});

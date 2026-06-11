
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
var tabledata = [
  {id:1, t1:"21,35", t2:"61,35", hum:"45,26", atm:191328, dp:"25,83", veab:"150,23", ps1:"65,23", ps2:"122,92", progress:12},
  {id:2, t1:"21,34", t2:"61,34", hum:"45,28", atm:191327, dp:"31,69", veab:"155,41", ps1:"61,68", ps2:"124,22", progress:1},
  {id:3, t1:"21,36", t2:"61,36", hum:"45,29", atm:191329, dp:"34,91", veab:"159,88", ps1:"64,21", ps2:"124,18", progress:42},
  {id:4, t1:"21,39", t2:"61,39", hum:"45,25", atm:191321, dp:"39,25", veab:"162,17", ps1:"69,28", ps2:"128,23", progress:100},
  {id:5, t1:"21,33", t2:"61,33", hum:"45,24", atm:191325, dp:"44,15", veab:"165,91", ps1:"64,32", ps2:"126,25", progress:16},
  {id:6, t1:"21,30", t2:"61,30", hum:"45,22", atm:191326, dp:"51,24", veab:"168,63", ps1:"61,19", ps2:"122,81", progress:38},
];

//create Tabulator on DOM element with id "example-table"
var table = new Tabulator("#example-table", {
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


// Copy buttons!!!
// Copy-all icon that copies the whole table
table.on("tableBuilt", function() {
  var button1 = document.getElementById('copy-table');
  button1.addEventListener('click', function(){
    table.copyToClipboard("all");
  });
});
// Copy-selected icon that copies the selected rows to the clipboard
table.on("tableBuilt", function(){
  var icon2 = document.getElementById('copy-selected');
  icon2.addEventListener('click', function(){
    table.copyToClipboard("selected"); //copy the currently selected rows to the clipboard
  });
});


// Interactivity for the button in the header
var svgIds = ['copy-table', 'copy-selected'];
document.addEventListener('click', function(event) {
  if (svgIds.includes(event.target.id)) {
    event.target.classList.add('clicked');

    setTimeout(() => {
      let paths = event.target.querySelectorAll('path');
      paths.forEach(path => path.setAttributeNS(null, 'fill', '#28a745')); // Change color to green

      setTimeout(() => {
        paths.forEach(path => path.setAttributeNS(null, 'fill', '')); // Change color back to original
        event.target.classList.remove('clicked');
      }, 5000); // Change color back after 5 seconds
    }, 400); // Change color after flash animation
  }
});


// Make the h4 tag  draggable
interact('#example-table')
  .draggable({
    inertia: true,
    // Keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: function() {
          var parent = document.querySelector('#example-table').parentNode;
          var parentRect = parent.getBoundingClientRect();
          return {left: parentRect.left, top: parentRect.top, right: Infinity, bottom: Infinity};
        },
        endOnly: true
      })
    ],
    // Enable autoScroll
    autoScroll: true,
    // Only allow drag actions to start when the h4 element is grabbed
    allowFrom: '#example-table h4',
    // Call this function on every dragmove event
    onmove: function (event) {
      var target = event.target,
          // Keep the dragged position in the data-x/data-y attributes
          x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
          y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
      // Update the position attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
      // Update the element's position in the document
      target.style.left = x + 'px';
      target.style.top = y + 'px';
    }
  });


  // Animation for the table name
  var tableElement = document.querySelector('#example-table');
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























var draggableItems = ['t1', 't1-1', 't1-1-1', 't2', 't3', 't4', 't5', 'header2', 'anotherElement', 'yetAnotherElement'];
var draggedElement = null;

// Loop over the table and make each item draggable
function makeItemDraggable(itemId) {
  interact('#' + itemId).draggable({
    // Draggable options...
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: '.main',
        endOnly: false
      })
    ],
    // enable autoScroll
    autoScroll: true,
    
    listeners: {
      start: function (event) {
        // Clone the target and append it to the body
        var clone = event.target.cloneNode(true);
        clone.id = 'clone'; // Give the clone a unique ID   *****toto treba vymazať potom, to je ten button čo netreba *****
        clone.style.position = 'absolute';
        clone.style.left = event.clientX + 'px';
        clone.style.top = event.clientY + 'px';
        // draggedElement.style.left = event.clientX - offsetX + 'px';
        // draggedElement.style.top = event.clientY - offsetY + 'px';
        document.body.appendChild(clone);
        draggedElement = clone;
        event.interactable.targetChecker = function (pointer, interactable, element, interacting) {
          return interacting && element === draggedElement;
        };

        // Store the original parent and next sibling of the draggable item
        event.target.setAttribute('data-original-parent', event.target.parentNode.id);
        event.target.setAttribute('data-original-next-sibling', event.target.nextSibling ? event.target.nextSibling.id : null);

        if (event.target.closest('.sidebar')) {
          console.log("event.target.closest('.sidebar')", event.target.closest('.sidebar'));
          event.target.setAttribute('element-inside', 'sidebar');
        }

        // Calculate the distance from the cursor to the element's top-left corner
        var rect = event.target.getBoundingClientRect();
        var offsetX = event.clientX - rect.left;
        var offsetY = event.clientY - rect.top;

        // Append the target to the body when the drag starts
        document.body.appendChild(event.target);

        // Set the initial position of the target to the mouse's position
        // draggedElement.style.position = 'absolute';

        // Prevent the original element from being dragged
        event.preventDefault();
      },


      move: dragMoveListener,


      end: function (event) {
        // Handle the case when the drag ends 
        // Check if the target was dropped in .main
        var inMain = document.querySelector('.main').contains(event.target);
        console.log("inMain",inMain); 

        if (inMain) {
          // Remove the clone from the sidebar
          // document.querySelector('.sidebar').removeChild(draggedElement);

          // Append the clone to the main area
          document.querySelector('.main').appendChild(draggedElement);

          // Get the id of the new item
          var newId = event.target.id;

          event.target.setAttribute('element-inside', 'main');
          // var draggedElement = event.target;

          // Delete the column from the table
          // var columnId = event.target.id;
          // console.log("columnId",columnId);
          // table.deleteColumn(columnId);

          // Remove the dragged element
          // var draggedElement = document.getElementById(columnId);
          console.log("draggedElement", draggedElement);

          // if (event.target && event.target.parentNode) {
          //   event.target.parentNode.removeChild(event.target);
          // }
          
          // Make new item draggable
          // makeItemDraggable(newId);

          
        } else {
          event.target.setAttribute('element-inside', 'sidebar');

          // Get the original parent and next sibling of the draggable item
          var originalParentId = event.target.getAttribute('data-original-parent');
          var originalNextSiblingId = event.target.getAttribute('data-original-next-sibling');

          var originalParent = document.getElementById(originalParentId);
          var originalNextSibling = document.getElementById(originalNextSiblingId);

          // Reset the position of the draggable item to its original position
          if (originalNextSibling) {
            console.log("originalNextSibling", originalNextSibling);
            originalParent.insertBefore(event.target, originalNextSibling);
          } else {
            console.log("originalParent", originalParent);
            // originalParent.appendChild(event.target);
            if (originalParent) { // Add this null check
              originalParent.appendChild(event.target);
            }
          }

          // Reset the style of the draggable item
          event.target.style.position = '';
          event.target.style.left = '';
          event.target.style.top = '';
          event.target.style.transform = '';
          event.target.removeAttribute('data-x');
          event.target.removeAttribute('data-y');

          // Add this line to remove the cloned element
          // if (event.target && event.target.parentNode && event.target.id !== draggedElement.id) {
          //   event.target.parentNode.removeChild(event.target);
          // }
        }
        if (draggedElement && draggedElement.parentNode) {
          draggedElement.parentNode.removeChild(draggedElement);
        }
        // draggedElement = null;

      }
    }
  });
}


// Initially run the function to make the items draggable
draggableItems.forEach(makeItemDraggable);


function dragMoveListener (event) {
  var target = draggedElement

  // If this is the first move event, start dragging the clone
  if (event.dx === 0 && event.dy === 0) {
    event.interactable.draggable({ origin: draggedElement });
  }
  
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}

     



// Add a counter for each draggable item
var draggableCounters = draggableItems.reduce(function(acc, item) {
  acc[item] = 0;
  return acc;
}, {});

function getNewId(event) {
  // Assuming the id of the dragged item is stored in a variable named draggedItemId
  var draggedItemId = event.relatedTarget.id;
  // Increment the counter for this draggable item
  draggableCounters[draggedItemId]++;
  // Append the counter to the id
  var newId = draggedItemId + '-' + draggableCounters[draggedItemId];
  return newId;
}













// this works fine when taking from table and putting it to main so it creates new table and delete the previous coulms in the table in which it was taken from
let tableCounter = 0;
var tables = {};

interact('.main').dropzone({
  ondrop: function (event) {
    // Handle the drop event...
    if (draggableItems.includes(event.relatedTarget.id)) {
      console.log("You sucessfully tested the existence of dragable element from the list");

      // Save the drop coordinates relative to the dropzone
      var dropX = event.dragEvent.pageX - event.target.offsetLeft;
      var dropY = event.dragEvent.pageY - event.target.offsetTop;
      console.log("dropX, dropY",dropX, dropY);
  
      // If the item was dragged from the sidebar
      if (event.relatedTarget.getAttribute('element-inside') === 'sidebar') {
        console.log(event.relatedTarget.getAttribute('element-inside'))
        console.log("The item was dragged from the sidebar");

        // Increment the table counter and generate a unique id for the new table
        tableCounter++;
        var newTableId = 'table-' + tableCounter;
        var newDiv = document.createElement("div");
        newDiv.id = newTableId;

        // Set the tabulator property on the new div
        newDiv.tabulator = tables[newTableId];

        // Once the div is ready, set its position to the drop coordinates
        newDiv.style.position = 'absolute';
        newDiv.style.left = dropX + 'px';
        newDiv.style.top = dropY + 'px';

        // Generate a new id for the item
        var newId = getNewId(event);
        // Update the id of the item
        event.relatedTarget.id = newId;
        // Append the cloned element to the new div
        newDiv.appendChild(event.relatedTarget);

        // Append the new div to the dropzone
        event.target.appendChild(newDiv);

        // Add the new id to the draggableItems array
        draggableItems.push(newId);
        // Make the new item draggable
        makeItemDraggable(newId);


        // Get the hiden span of a unit as a text
        var unit = document.querySelector(`#${event.relatedTarget.id} .unit`).textContent;
        console.log("draggedItemId, unit",event.relatedTarget.id, unit);

        // Create a new table
        tables[newTableId] = new Tabulator("#" + newTableId, {
          // Table options...
          data:tabledata,           //load row data from array
          height:"auto",            // Set height to auto
          layout:"fitData",         //resize the tables columns to fit the data held in each column, unless you specify a width or minWidth
          movableColumns:false, 

          columnHeaderVertAlign:"bottom",
          columns:[  
            {title: "Table " + tableCounter, // This is the group header
              columns:[      
                {title:`<div id="${newId}">${event.relatedTarget.innerHTML} ${unit}</div>`,
                field:event.relatedTarget.id,
                minWidth:50},
              ],
            },
          ]
        });


        // Update the element-inside attribute
        event.relatedTarget.setAttribute('element-inside', 'main');

        // toto robí problémy pri posúvaní dragable elementov z tabulky do main
        // makeItemsDraggable();
    
      } else {
        // If the item was dragged from a table, keep the same id
        var oldId = event.relatedTarget.id;

        // Update the element-inside attribute
        event.relatedTarget.setAttribute('element-inside', 'main');

        // Move the item within the dropzone
        // ...
      }


  }
  }
});



// Make the table headers dropzones
interact('.tabulator-col-group-cols').dropzone({
  ondrop: function (event) {
    if (draggableItems.includes(event.relatedTarget.id)) {
      console.log("im in the header");

      // Get the Tabulator instance of the table that the item is dropped on
      var tableElement = event.target.closest('.tabulator');
      console.log("tableElement", tableElement);
      var tableInstance = tableElement.tabulator;
      console.log("tableInstance", tableInstance);

      // Get the index of the column where the element was dropped
      var columnIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
      console.log("columnIndex", columnIndex);

      var newId = getNewId(event);
      // Get the hiden span of a unit as a text
      var unit = document.querySelector(`#${event.relatedTarget.id} .unit`).textContent;


      // Insert a new column at that index
      tableInstance.addColumn({
        title: `<div id="${newId}">${event.relatedTarget.innerHTML} ${unit}</div>`,        
        field: event.relatedTarget.id,
        minWidth: 50,
      }, false, columnIndex);
      console.log("event.relatedTarget.innerHTMLsssss", event.relatedTarget.innerHTML);
    }
  }
});











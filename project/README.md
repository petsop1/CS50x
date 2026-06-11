# Flow State
#### Video Demo:  <[https://youtu.be/JRIY7zJE98Y](https://youtu.be/JRIY7zJE98Y)>


Project title: Flow State
Author: Peter Sopkuliak
GitHub username: petsop1
edX username: petsop
Authors city and country: Samorin, Slovakia
Day of recording: 29.5.2024

## Description:
Application Overview
This application is a basic draft of the future intended version. The backend is built on the Flask framework, and the web interface primarily uses the Bootstrap library, with additional libraries integrated to enhance functionality mainly Tabulator, Interact JS, Anime JS and other libraries.

## Key Features
### Login and User Authentication

#### Login Page:
The top navigation bar includes an animated logo, which consists of four columns representing a histogram. These bars change size and color based on mouse hover, increasing and decreasing according to specific rules. Initially, I struggled with this feature, but it now works smoothly.
Next to the logo is the app's name, formatted with a hover effect similar to the rest of the text in the top navigation bar.
"Log in" and "Join" buttons are prominently displayed. Registered users can use links directly on the page.
There is a "Forgot your password" section, which is not yet implemented. However, a placeholder informs users about this.
Email addresses are verified when submitting a form via POST request using email_validator.
The password field has an eye icon functionality, allowing users to show or hide their typed password. All input fields feature a responsive design with icons, meticulously aligned for an aesthetically pleasing layout.

#### Join Page:
Password validation is implemented both in JavaScript and on the backend with Flask, ensuring robust security. The user experience is enhanced with friendly messages indicating which password requirements (e.g., 8 characters, one uppercase letter, some numbers) are unmet.

More than one-third of the screen on the join page displays a picture dynamically fetched from the Unsplash API. Setting up this feature required learning how the API works and adjusting it thematically to fit the application's needs. Different APIs are used for various routes to ensure thematic relevance. If the allowed number of pictures is exceeded, three or four basic pictures are randomly selected and served.

The join page also includes sections for Terms and Privacy Policy. Although the content is placeholder text, it is formatted into a parallax effect, ready for future updates. The Privacy Policy section includes a simple snake game, mostly generated using AI tools, to provide interactive content.

After successful registration, a verification email is sent to the provided email address. Users must verify their email within one hour to access the index route and the application.

### User Interface and Navigation
#### Index Route:
Features a full top navigation bar and a side navigation bar, both responsive to screen size.
Includes a custom toggle button for switching between light and dark themes. This toggle state is stored in an SQLite3 database along with other user settings, ensuring the preferred theme is loaded upon login.
A dropdown button displays the logged-in user's initials. Algorithms ensure that initials are unique, and each user is assigned a random icon color upon first login. These colors are chosen for visibility in both themes.
Users can change their icon color via a route that displays color rectangles. Clicking a rectangle saves the selected color to the database. The "Change password" feature is not yet implemented, as it requires deployment and user confirmation functionalities. The dropdown menu also includes a logout button that logs the user out of the system.


### Main Page

#### Side Navigation Panel:
Displays the app name and its main purpose.
Includes button elements that can be dragged and dropped into the main page area to create tables using the Tabulator library. These elements are formatted according to ISO standards, with italic text indexing and icons representing the sensor type. Currently, only temperature sensors are available.
Each dropped element creates a new table with unique indexing. An example table is displayed upon login. These tables can be dragged and moved within the main area, with animations provided by the Interact JS and Anime JS libraries. Visual feedback is given during the drag-and-drop process, indicating valid drop zones.
Additional sensors can be added to existing tables by dragging and dropping them onto the table group header. This action is animated, showing above which column the sensor will be dropped, with a small triangle indicator marking the drop location. Columns can be deleted by dragging them to the side navigation panel.
Table Functionality:

New columns can be interactively added to tables, with visual indicators showing where they will be placed. Deleted columns are removed by dragging them to the side navigation panel, with all processes being interactive and animated.

### Future Improvements
Implement the "Forgot your password" functionality.
Add a "Change password" feature.
Expand the types of sensors available and improve table interactions.
Enhance the Terms and Privacy Policy sections with more relevant content.
Continuously update and refine the application based on user feedback and new requirements.
Connect tables with real sensors based on Arduino or other hardware


### Technical Details
The application leverages the Flask framework for the backend, providing a robust and scalable foundation.
The frontend utilizes the Bootstrap library for responsive design, with additional libraries such as Interact JS and Anime JS for animations and interactions and others.
User data and preferences are stored in an SQLite3 database, ensuring persistence across sessions.
The Unsplash API is integrated for dynamic image fetching, adding visual appeal to the join page and other routes.
Conclusion
This application serves as a basic playground for further development. The current features provide a solid foundation, with interactive elements, responsive design, and robust user authentication. Future enhancements will build on this foundation, adding more functionality and improving the user experience.

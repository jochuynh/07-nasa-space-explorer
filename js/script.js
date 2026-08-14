// Get the date inputs from the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const gallery = document.getElementById('gallery');
const getImagesButton = document.querySelector('button');
const spaceFact = document.getElementById('spaceFact');

// Get modal elements
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const modalCloseButton = document.querySelector('.modal-close');

// Use the NASA API key provided for this project
const apiKey = 'LUd6SBbK7agBy2qpgKOaY4T7gX4iRYERNLh9c9gO';

// Array of fun space facts to display
const spaceFacts = [
  "A day on Venus is longer than a year on Venus! Venus takes 243 Earth days to rotate, but only 225 days to orbit the Sun.",
  "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth. When you look at the Sun, you're seeing it as it was 8 minutes ago!",
  "A neutron star is so dense that a teaspoon of its material would weigh about 6 billion tons on Earth.",
  "There are more stars in the universe than grains of sand on all of Earth's beaches.",
  "Jupiter has a Great Red Spot—a storm larger than Earth that has been raging for at least 400 years!",
  "If the Sun were hollow, about 1.3 million Earths could fit inside it.",
  "The Moon is slowly moving away from Earth at a rate of about 3.8 centimeters per year.",
  "Astronauts in space grow about 2 inches taller because there's no gravity pulling down on their spine.",
  "A year on Neptune is 165 Earth years. A Neptunian who just turned 1 would only be 165 Earth years old!",
  "The International Space Station orbits Earth every 90 minutes, completing 16 sunrises and sunsets each day.",
  "Saturn's rings are made mostly of ice and rock, ranging in size from tiny grains to house-sized boulders.",
  "The Sun accounts for 99.86% of all the mass in our entire solar system.",
  "Alpha Centauri, our closest star system, is over 4 light-years away. It would take 40,000 years to travel there with current spacecraft!",
  "Pluto is smaller than Earth's moon, yet it has 5 moons of its own orbiting it.",
  "The footprints left by Apollo astronauts on the Moon will likely remain there for millions of years since there's no wind or erosion.",
  "Mercury has no atmosphere, so temperatures swing wildly from 430°C during the day to -180°C at night.",
  "Uranus rotates on its side—its axis is tilted at 98 degrees compared to its orbit around the Sun.",
  "A supernova explosion can briefly outshine an entire galaxy containing billions of stars.",
  "The Milky Way is moving through space at about 2 million kilometers per hour.",
  "If you could somehow stand on the surface of the Sun, the radiation would kill you in a fraction of a second."
];

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Function to display a random space fact
function displayRandomFact() {
  // Pick a random index from the spaceFacts array
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  
  // Reset the animation by removing the class
  spaceFact.classList.remove('fade-in');
  
  // Trigger a reflow to restart the animation
  void spaceFact.offsetWidth;
  
  // Add the fade-in class to trigger the animation
  spaceFact.classList.add('fade-in');
  
  // Set the fact text to the randomly selected fact
  spaceFact.textContent = spaceFacts[randomIndex];
}

// Display a random fact when the page loads
displayRandomFact();

// This function fetches NASA photos between the selected dates
async function getSpaceImages() {
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Make sure the user picked a valid date range
  if (!startDate || !endDate) {
    gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon">⚠️</div><p>Please select both dates before searching.</p></div>';
    return;
  }

  // If the end date is before the start date, show an error message
  if (new Date(endDate) < new Date(startDate)) {
    gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon">⚠️</div><p>End date must be after the start date.</p></div>';
    return;
  }

  // Show a loading message while the API request is working
  gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon rocket-launch">🚀</div><p>Loading space images...</p></div>';

  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('NASA API request failed');
    }

    const photos = await response.json();

    // If there are no photos in the selected date range, show a message
    if (!photos.length) {
      gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon">🌌</div><p>No images were found for that date range.</p></div>';
      return;
    }

    // Clear the gallery and insert each photo card
    gallery.innerHTML = '';

    photos.forEach((photo) => {
      // Create a card for both images and videos
      const card = document.createElement('div');
      card.className = 'gallery-item';
      // Store the photo data in the card so we can access it when clicked
      card.dataset.photoData = JSON.stringify(photo);
      card.dataset.mediaType = photo.media_type;

      // Check if this is a video or an image
      if (photo.media_type === 'video') {
        // For videos, extract the YouTube video ID from the URL
        // NASA APOD videos are typically embedded from YouTube
        const videoId = extractYouTubeId(photo.url);
        
        // Create a container for the thumbnail and badge
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'thumbnail-container';
        
        // Create a thumbnail image element
        const thumbnail = document.createElement('img');
        
        // Use YouTube's thumbnail if we have a valid video ID, otherwise use NASA logo
        if (videoId) {
          thumbnail.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        } else {
          // Use NASA logo as fallback thumbnail for videos without valid YouTube IDs
          thumbnail.src = 'img/nasa-worm-logo.png';
        }
        
        thumbnail.alt = photo.title;
        thumbnail.className = 'gallery-item-thumbnail';

        // Add a video badge to indicate this is a video
        const videoBadge = document.createElement('div');
        videoBadge.className = 'video-badge';
        videoBadge.innerHTML = '▶ VIDEO';

        const title = document.createElement('h3');
        title.textContent = photo.title;

        const date = document.createElement('p');
        date.textContent = photo.date;

        // Create a "Watch on YouTube" button
        const watchButton = document.createElement('a');
        watchButton.href = photo.url;
        watchButton.target = '_blank';
        watchButton.className = 'watch-video-button';
        watchButton.textContent = '▶ Watch on YouTube';

        // Add thumbnail and badge to the container
        thumbnailContainer.appendChild(thumbnail);
        thumbnailContainer.appendChild(videoBadge);
        
        card.appendChild(thumbnailContainer);
        card.appendChild(title);
        card.appendChild(date);
        card.appendChild(watchButton);
        
        // Clicking anywhere on the card except the button will also open the video
        card.addEventListener('click', (e) => {
          if (e.target !== watchButton) {
            window.open(photo.url, '_blank');
          }
        });
      } else {
        // For images, create the normal image card
        const image = document.createElement('img');
        image.src = photo.url;
        image.alt = photo.title;

        const title = document.createElement('h3');
        title.textContent = photo.title;

        const date = document.createElement('p');
        date.textContent = photo.date;

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(date);
        
        // When the card is clicked, open the modal with the full photo details
        card.addEventListener('click', () => {
          openModal(photo);
        });
      }
      
      gallery.appendChild(card);
    });

    // If no photos or videos were found, tell the user
    if (gallery.children.length === 0) {
      gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon">🛰️</div><p>No images or videos were found for that date range. Try another date range.</p></div>';
    }
  } catch (error) {
    console.error('Error loading NASA images:', error);
    gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon">⚠️</div><p>Something went wrong while loading the images. Please try again.</p></div>';
  }
}

// Function to extract YouTube video ID from a URL
function extractYouTubeId(url) {
  // Handle different YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/embed\/)([\w-]+)/,           // embed URLs
    /youtube\.com\/watch\?v=([\w-]+)/,             // youtube.com/watch?v=
    /youtu\.be\/([\w-]+)/,                          // youtu.be/
    /youtube\.com\/v\/([\\w-]+)/,                    // youtube.com/v/
    /youtube\.com\/\?v=([\\w-]+)/,                   // youtube.com/?v=
  ];
  
  for (let pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  // Return null if no valid YouTube ID is found
  return null;
}

// Function to open the modal and fill it with the clicked photo's details
function openModal(photo) {
  modalImage.src = photo.hdurl || photo.url;
  modalImage.alt = photo.title;
  modalTitle.textContent = photo.title;
  modalDate.textContent = photo.date;
  modalExplanation.textContent = photo.explanation;
  
  // Show the modal by adding the 'active' class
  modal.classList.add('active');
}

// Function to close the modal
function closeModal() {
  modal.classList.remove('active');
}

// Close the modal when the user clicks the close button
modalCloseButton.addEventListener('click', closeModal);

// Close the modal when the user clicks on the dark background (outside the modal content)
modal.addEventListener('click', (event) => {
  // Only close if the click is directly on the modal background, not on the content
  if (event.target === modal) {
    closeModal();
  }
});

// Close the modal when the user presses the Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

// Run the fetch when the user clicks the button
getImagesButton.addEventListener('click', getSpaceImages);

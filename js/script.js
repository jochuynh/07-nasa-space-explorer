// Get the date inputs from the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const gallery = document.getElementById('gallery');
const getImagesButton = document.querySelector('button');

// Use the NASA API key provided for this project
const apiKey = 'LUd6SBbK7agBy2qpgKOaY4T7gX4iRYERNLh9c9gO';

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

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
  gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon">🚀</div><p>Loading space images...</p></div>';

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
      // Skip videos because this gallery is for photos
      if (photo.media_type !== 'image') {
        return;
      }

      const card = document.createElement('div');
      card.className = 'gallery-item';

      const image = document.createElement('img');
      image.src = photo.url;
      image.alt = photo.title;

      const title = document.createElement('h3');
      title.textContent = photo.title;

      const date = document.createElement('p');
      date.textContent = photo.date;

      const description = document.createElement('p');
      description.textContent = photo.explanation;

      card.appendChild(image);
      card.appendChild(title);
      card.appendChild(date);
      card.appendChild(description);
      gallery.appendChild(card);
    });

    // If the date range only contains videos, tell the user there are no photos
    if (gallery.children.length === 0) {
      gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon">🛰️</div><p>No photos were found in that range. Try another date range.</p></div>';
    }
  } catch (error) {
    console.error('Error loading NASA images:', error);
    gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon">⚠️</div><p>Something went wrong while loading the images. Please try again.</p></div>';
  }
}

// Run the fetch when the user clicks the button
getImagesButton.addEventListener('click', getSpaceImages);

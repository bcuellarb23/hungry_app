// Dynamically set the API URL based on where the app is hosted
// If hosted on Render, it will use the production domain.
// If local, it uses the local origin.
const API_BASE_URL = `${window.location.origin}/api`;

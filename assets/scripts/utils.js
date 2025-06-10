// Check file type based on extension
export const isFileText = (extension) => {
  return ['txt', 'log', 'csv', 'json', 'xml', 'yaml'].includes(extension.toLowerCase());
}
export const isFileImage = (extension) => {
  return ['jpeg', 'bmp', 'gif', 'jpg', 'svg'].includes(extension.toLowerCase());
}
export const isFileVideo = (extension) => {
  return ['mp4', 'webm', 'ogg'].includes(extension.toLowerCase());
}
export const isFileAudio = (extension) => {
  return ['mp3', 'wav'].includes(extension.toLowerCase());
}
export const isFilePDF = (extension) => {
  return extension.toLowerCase() === 'pdf';
}

// Get file URL from the current page's URL parameters
// Example URL: https://example.com/page?url=https://example.com/file.txt
export const getFileUrlFromCurrentPage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('url');
}
// Get file extension from a file URL
// Example URL: https://example.com/file.txt
export const getExtensionFromUrl = (fileUrl) => { return fileUrl.split('.').pop().toLowerCase() }

// Create HTML elements for different basic file types

export const createTextElement = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorElem = document.createElement('div');
      errorElem.textContent = 'Netowrk error when fetching file: ' + response.statusText;
      return errorElem;
    }
    const text = await response.text();
    const pre = document.createElement('pre');
    pre.textContent = text;
    return pre;
  } catch (error) {
    const errorElem = document.createElement('div');
    errorElem.textContent = 'Error loading file: ' + error.message;
    return errorElem;
  }
};

export const createImageElement = (url) => {
  const img = document.createElement('img');
  img.src = url;
  img.style.maxWidth = '100%';
  img.style.maxHeight = '600px';
  // Optional: added on suggestion
  img.style.objectFit = 'contain'; // Ensures the image fits within the container
  img.style.backgroundColor = '#f0f0f0'; // Optional: Set a background color for better visibility
  img.setAttribute('referrerpolicy', 'no-referrer'); // Optional: Prevent referrer information from being sent
  img.setAttribute('controlsList', 'nodownload'); // Optional: Disable download controls
  return img;
}
export const createVideoElement = (url) => {
  const video = document.createElement('video');
  video.src = url;
  video.controls = true;
  video.style.width = '100%';
  video.style.maxHeight = '600px';
  // Optional: added on suggestion
  video.style.objectFit = 'contain'; // Ensures the video fits within the container
  video.style.backgroundColor = '#000'; // Optional: Set a background color for better visibility
  video.setAttribute('controlsList', 'nodownload'); // Optional: Disable download controls
  return video;
}
export const createAudioElement = (url) => {
  const audio = document.createElement('audio');
  audio.src = url;
  audio.controls = true;
  audio.style.width = '100%';
  // Optional: added on suggestion
  audio.style.maxHeight = '100px'; // Set a max height for audio controls
  audio.style.objectFit = 'contain'; // Ensures the audio controls fit within the container
  audio.style.backgroundColor = '#f0f0f0'; // Optional: Set a background color for better visibility
  audio.setAttribute('controlsList', 'nodownload'); // Optional: Disable download controls
  return audio;
}
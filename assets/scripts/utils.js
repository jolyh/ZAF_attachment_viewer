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

// Create HTML elements for different basic file types
export const createImageElement = (url) => {
  const img = document.createElement('img');
  img.src = url;
  img.style.maxWidth = '100%';
  img.style.maxHeight = '600px';
  return img;
}
export const createVideoElement = (url) => {
  const video = document.createElement('video');
  video.src = url;
  video.controls = true;
  video.style.width = '100%';
  return video;
}
export const createAudioElement = (url) => {
  const audio = document.createElement('audio');
  audio.src = url;
  audio.controls = true;
  audio.style.width = '100%';
  return audio;
}

// Get file URL from the current page's URL parameters
// This function assumes the URL has a query parameter named 'url'
export const getFileUrlFromCurrentPage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('url');
}
// Get file extension from a file URL like https://example.com/file.txt
export const getExtensionFromUrl = (fileUrl) => { return fileUrl.split('.').pop().toLowerCase() }
let client = null;
let allAttachments = [];
let simplifiedAttachments = [];

// Note to self
// Todo the open here method - add a currently opened attachment var + set it on open - add an iframe to html to render content

// ------------------------
// Attachment Functions
// ------------------------

// This function will be called to get all attachments from the conversation log
// The result is stored in the global variable `allAttachments`
const getAllAttachments = (events) => {
  allAttachments = [];
  events.forEach(event => {
    allAttachments.push(...event.attachments.map(attachment => ({
      ...attachment,
      created_at: event.created_at // Add the comment created_at to the attachment
    })))
  });
}

const simplifyAttachments = (allAttachments) => {
  simplifiedAttachments = []
  console.log("simplifyAttachments")
  console.log(allAttachments)
  allAttachments.forEach(attachment => {
    if (attachment.malware_scan_result != 'malware_found') {
      simplifiedAttachments.push(
        {
          content_type: attachment.content_type, // Mime type of the attachment - could be used for more precised filtering
          id: attachment.id, // Unique identifier for the attachment
          // size: attachment.size, // Optional: size in bytes
          name: attachment.file_name, // Name to display
          url: attachment.mapped_content_url, // URL to access the attachment
          category: isFileMedia(attachment.content_type) ? "media" : "file", // Optional for easy filtering
          created_at: attachment.created_at // Optional: creation date
        }
      )
    }
  });
  return simplifiedAttachments
}

const filterAttachments = (attachments, type) => {
  if (type === 'media') {
    return attachments.filter(attachment => attachment.category === 'media'); // Filter media attachments
  } else if (type === 'file') {
    return attachments.filter(attachment => attachment.category === 'file'); // Filter file attachments
  }
  return []; // Return empty array if type is unknown
}

// Lazy method to check if the file category is a file or media - good enough for now
const isFileMedia = (contentType) => {
  return contentType.startsWith('image/') || contentType.startsWith('video/') || contentType.startsWith('audio/');
}

// ------------------------
// Click Handlers
// ------------------------

/**
 * Handles the click event for the category checkboxes.
 * @param {Boolean} fileChecked 
 * @param {Boolean} mediaChecked 
 */
export const handleCategoryCheckboxClick = (fileChecked, mediaChecked) => {
  let filtered_list = simplifiedAttachments
  if (fileChecked && !mediaChecked) {
    filtered_list = filterAttachments(simplifiedAttachments, 'file');
  } else if (!fileChecked && mediaChecked) {
    filtered_list = filterAttachments(simplifiedAttachments, 'media');
  }
  renderAttachmentsList(filtered_list);
}

export const handleAttachment = (url) => {

  client.invoke('instances.create', {
    location: 'modal',
    url: "assets/modal_iframe.html?url=" + url,
    size: { // optional
      width: '1000px',
      height: '600px'
    }
  }).then((modalContext) => {
    // The modal is on screen now
    var modalClient = client.instance(modalContext['instances.create'][0].instanceGuid);

    modalClient.on('modal.close', () => {
      // The modal has been closed
    });
  });

}

// ------------------------
// UI Rendering
// ------------------------

// Render the attachments list using Handlebars
const renderAttachmentsList = (attachments) => {

  const attachmentsData = {
    attachments: attachments
  };

  const source = document.getElementById("attachments-template").innerHTML;
  const template = Handlebars.compile(source);
  const html = template(attachmentsData);

  document.getElementById("attachments-content").innerHTML = html;
}

// ------------------------
// Ticket Data
// ------------------------
const fetchConversationLog = async () => {
  const ticketData = await client.get('ticket.id');
  const ticketId = ticketData['ticket.id'];
  const conversation_log = await client.request({
    url: `/api/v2/tickets/${ticketId}/conversation_log.json`,
    type: 'GET'
  });
  return conversation_log.events;
}

const fetchAndUpdateAttachments = async () => {
  fetchConversationLog().then(events => {
    // Get all attachments from the conversation log
    getAllAttachments(events);
    // Simplify the attachments for rendering
    simplifyAttachments(allAttachments);
    // Render the attachments list
    renderAttachmentsList(simplifiedAttachments);
  }).catch(error => {
    document.getElementById("attachments-content").innerHTML = `<p>Error loading attachments.</p><br><p>${error.message}</p>`;
  })
}

// ------------------------
// Main App Logic
// ------------------------
(async () => {
  client = ZAFClient.init();
  client.invoke('resize', { width: '100%', height: '200px' });

  fetchAndUpdateAttachments();

  client.on('ticket.updated', () => { fetchAndUpdateAttachments(); });

})();
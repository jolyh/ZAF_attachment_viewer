let client = null


// ------------------------
// Attachment Functions
// ------------------------
const getAllAttachments = (events) => {
  const allAttachments = [];
  events.forEach(event => {
    // check on malware false could be done here - it's a property of the attachment
    allAttachments.push(...event.attachments)
  });
  return allAttachments
}

const simplifyAttachments = (allAttachments) => {
  const simplifiedAttachments = []
  allAttachments.forEach(attachment => {
    // OR check on malware false could be done here
    simplifiedAttachments.push(
      {
        format: attachment.content_type,
        id: attachment.id,
        size: attachment.size,
        name: attachment.file_name,
        url: attachment.mapped_content_url,
        viewType: attachment.content_type.includes("image") ? "image" : "file"
      }
    )
  });
  return simplifiedAttachments
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
const renderAttachmentsList = (attachments) => {
  //console.log(attachments)
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
    const allAttachments = getAllAttachments(events);
    const simplifiedAttachments = simplifyAttachments(allAttachments);
    renderAttachmentsList(simplifiedAttachments);
  }).catch(error => {
    document.getElementById("attachments-content").innerHTML = "<p>Error loading attachments.</p>";
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
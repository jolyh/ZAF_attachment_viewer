# App name

This apps displays a list of the attachments present in the current ticket.
Your agents will be able to preview the attachments by clicking on the items in the list.

### The following information is displayed:

* Link of the attchment

Please submit bug reports to [Insert Link](). Pull requests are welcome.

### Screenshot(s):

### Supported format
* Text: 'txt', 'log', 'csv', 'json', 'xml', 'yaml'
* Image: 'jpeg', 'bmp', 'gif', 'jpg', 'svg'
* Video: 'mp4', 'webm', 'ogg'
* Audio: 'mp3', 'wav'
* Pdf

### Important
Zendesk does not verify that files are different. If you add the same file multiple times over the life of the ticket, Zendesk will keep both and will not remove or prevent duplication and each will have its own id. If a file appears multiple time (same name and content), then it will be listed multiple time by the app.

### How to test the app

* Start the apps with `npx @zendesk/zcli apps:server`
* On your support ticket, add `?zcli_apps=true` to url
* You will see the apps displayed in the sidebar and be able to test the preview

### TODO list
- Update icon
- UI elements
- Margin and scrolling is not great 
- open inside iframe instead of modal as an option
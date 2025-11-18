# Neuro AI

Neuro AI is a personal AI assistant built using web technologies (HTML, CSS, and JavaScript). It aims to provide a suite of helpful features, including voice-controlled music playback, encrypted file sharing, voice note taking, and WhatsApp message sending via voice commands.

## 📸 Preview
 <img width="1350" height="640" alt="neuro_ai" src="https://github.com/user-attachments/assets/e67b2575-9164-4fd9-a0c5-8a1d17b176a7" />

## Features

-   **Voice-Controlled Music Playback:** Play songs on YouTube by simply using voice commands.
-   **Encrypted File Sharing:** Securely share files with encryption.
-   **Voice Note Taking:** Record and store voice notes.
-   **WhatsApp Message Sending:** Send WhatsApp messages hands-free using voice commands.
-   **Cloud Storage Application:** Upload and store files in the cloud.
-   **File Organization:** Organize files efficiently.
-   **Face Recognition:** Utilizes face recognition for a personalized experience.

## Requirements

-   Web browser with JavaScript support
-   Microphone for voice input
-   Internet connection

## Installation

Since Neuro AI is built using web technologies, there is no traditional installation process. Simply clone the repository to your local machine:

```bash
git clone <repository_url>
cd neuro-ai
```

Alternatively, you can download the ZIP file of the repository and extract it.

## Usage

Open the `index.html` file in your web browser. You can then interact with the AI using the provided interface and voice commands. Specific usage instructions for each feature are described below:

-   **Voice-Controlled Music Playback:**
    1.  Ensure your microphone is enabled.
    2.  Use the voice command "play song" followed by the song name.
    3.  The AI will open YouTube and play the requested song.
-   **Encrypted File Sharing:**
    1.  Open `file/file-share.html` in your browser.
    2.  Select a file to upload.
    3.  A QR code will be generated. Scan the QR code with your mobile device to download the file.
    4.  The receiver can access the file by opening `reciver.html` and connecting to the specified WebSocket server.
-   **Voice Note Taking:**
    1.  Open `notes.html` in your browser.
    2.  Use the microphone to record voice notes.
    3.  The notes will be saved locally.
-   **WhatsApp Message Sending:**
    1.  The AI will redirect you to `redirect.html`.
    2.  Make sure the `redirectPhone` and `redirectMsg` items are stored to localStorage.
    3.  A new tab will open on WhatsApp web with the contact and message provided
-   **Cloud Storage Application**
    1.  Open `web_host/dash/dash.html` in your browser.
    2.  Use the "Upload" button to upload files to cloud.
    3.  Features like Pause, resume, and cancel are available.

## File structure

```
neuro-ai/
├── smart_ai/
│   ├── 3.js             # JavaScript file for voice functionality.
│   ├── ai.css           # CSS file for styling the main AI interface.
│   ├── ai.html          # Main HTML file for the AI interface.
│   ├── contact.html     # HTML file for the contact form.
│   ├── file/            # Directory for file sharing related files.
│   │   ├── file-share.html # HTML file for file sharing interface.
│   ├── file-share.js    # JavaScript file for file sharing functionality.
│   ├── file_Organizer/  # Directory for file organization related files.
│   │   ├── org.html       # HTML file for the file organizer interface.
│   ├── index.html       # HTML file for face recognition functionality.
│   ├── notes.html       # HTML file for the voice notes interface.
│   ├── player.html      # HTML file for the music player interface.
│   ├── reciver.html     # HTML file for the file receiver.
│   ├── redirect.html    # HTML file for redirecting to WhatsApp.
│   ├── try.html         # HTML file for the advanced HUD interface.
│   ├── web_host/        # Directory for web hosting related files.
│   │   ├── dash/          # Directory for cloud storage application.
│   │   ├── dash.html      # HTML file for cloud storage dashboard.
├── README.md        # This file.
```

## Testing

Currently, there are no automated tests for this project. Manual testing is required to verify the functionality of each feature.

To test:

1.  Open the relevant HTML file in your browser.
2.  Follow the usage instructions for the feature you are testing.
3.  Verify that the feature is working as expected.
4.  Check the browser console for any errors.

## Configuration

Some features of Neuro AI may require configuration. For example, the file sharing feature requires a WebSocket server URL to be specified in the `reciver.html` file.

```html
const socket = new WebSocket("wss://your-server-url"); // Replace with actual server URL
```

Replace `"wss://your-server-url"` with the actual URL of your WebSocket server.

## Contributing

Contributions are welcome! If you would like to contribute to Neuro AI, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes.
4.  Test your changes thoroughly.
5.  Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Improvements

-   Implement automated tests.
-   Add more features.
-   Improve the user interface.
-   Refactor the code for better readability and maintainability.
-   Add documentation for each feature.
-   Implement user authentication and authorization.
-   Host the AI on a web server so that it can be accessed from anywhere.

// // Firebase config
// const firebaseConfig = {
//   apiKey: "AIzaSyDXhnleVUiVf9Lxid3FUx4PjmXSMa4GG48",
//   authDomain: "playground-49b16.firebaseapp.com",
//   databaseURL: "https://playground-49b16-default-rtdb.firebaseio.com",
//   projectId: "playground-49b16",
//   storageBucket: "playground-49b16.appspot.com",
//   messagingSenderId: "250708767405",
//   appId: "1:250708767405:web:7cdfbccd539f39b8db8c24"
// };
// firebase.initializeApp(firebaseConfig);

// // Anonymous sign-in
// firebase.auth().signInAnonymously()
//   .then(() => console.log("Signed in anonymously"))
//   .catch(error => console.error('Sign-in error:', error));

// // DOM elements
// const upload = document.querySelector('.upload');
// const hiddenBtn = document.querySelector('.hidden-upload-btn');
// const progress = document.querySelector('.progress');
// const percent = document.querySelector('.percent');
// const pause = document.querySelector('.pause');
// const resume = document.querySelector('.resume');
// const cancel = document.querySelector('.cancel');

// // File list container
// const expandContainer = document.querySelector('.expand-container');
// const expandContainerUl = expandContainer.querySelector('ul');
// const loader = document.querySelector('.loader');

// // Metadata storage
// if (!localStorage.getItem("uploaded-metadata")) {
//   localStorage.setItem("uploaded-metadata", JSON.stringify([]));
// }

// // Trigger file input
// upload.onclick = () => hiddenBtn.click();

// // Handle file selection
// hiddenBtn.onchange = () => {
//   const files = hiddenBtn.files;
//   if (!files.length) return;

//   Array.from(files).forEach(file => uploadFile(file));
// };

// let currentUploadTask = null;

// // Upload file function
// function uploadFile(file) {
//   let type = file.type.split('/')[0];
//   if (!['video', 'audio', 'image'].includes(type)) {
//     type = 'others'; // fallback folder
//   }

//   const name = `${file.name.split('.').shift()}_${Date.now()}.${file.name.split('.').pop()}`;
//   const path = `${type}/${name}`;
//   const storageRef = firebase.storage().ref(path);
//   const uploadTask = storageRef.put(file);
//   currentUploadTask = uploadTask;

//   // Pause, resume, cancel buttons
//   pause.onclick = () => {
//     uploadTask.pause();
//     pause.style.display = 'none';
//     resume.style.display = 'inline-block';
//   };
//   resume.onclick = () => {
//     uploadTask.resume();
//     resume.style.display = 'none';
//     pause.style.display = 'inline-block';
//   };
//   cancel.onclick = () => {
//     uploadTask.cancel();
//     resetProgress();
//   };

//   upload.disabled = true;
//   percent.innerText = '0%';

//   uploadTask.on('state_changed',
//     snapshot => {
//       const progressValue = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//       progress.style.width = `${progressValue}%`;
//       percent.innerText = `${progressValue}%`;
//     },
//     error => {
//       console.error(error);
//       resetProgress();
//     },
//     () => {
//       let metadata = JSON.parse(localStorage.getItem("uploaded-metadata"));
//       metadata.unshift(path);
//       localStorage.setItem("uploaded-metadata", JSON.stringify(metadata));

//       percent.innerText = 'DONE';
//       upload.disabled = false;
//       hiddenBtn.value = '';
//       showFilesList();
//     }
//   );
// }

// // Reset progress UI
// function resetProgress() {
//   progress.style.width = '0%';
//   percent.innerText = '0%';
//   upload.disabled = false;
//   hiddenBtn.value = '';
//   pause.style.display = 'inline-block';
//   resume.style.display = 'none';
// }

// // Load file list on page load
// window.onload = showFilesList;

// // Display uploaded files
// function showFilesList() {
//   const data = JSON.parse(localStorage.getItem("uploaded-metadata")) || [];

//   ['video', 'audio', 'image', 'others'].forEach(type => {
//     const container = document.getElementById(type);
//     if (container) container.innerHTML = '';
//   });

//   data.forEach(path => {
//     const [folder, fileName] = path.split('/');
//     let container = document.getElementById(folder);
//     if (!container) container = document.getElementById('others');
//     if (container) {
//       container.innerHTML += `
//         <li data-name="${path}">
//           <span>${fileName}</span>
//           <svg onclick="expand(this)" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
//             <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
//           </svg>
//         </li>
//       `;
//     }
//   });
// }

// // Expand file options menu
// function expand(elem) {
//   const path = elem.parentElement.getAttribute('data-name');
//   const rect = elem.getBoundingClientRect();
//   expandContainer.style.display = 'block';
//   expandContainerUl.style.display = 'block';
//   loader.style.display = 'none';
//   expandContainer.style.left = `${rect.left + window.scrollX - 85}px`;
//   expandContainer.style.top = `${rect.top + window.scrollY + 25}px`;
//   expandContainer.setAttribute('data-value', '1');
//   expandContainerUl.setAttribute('data-file-name', path);
//   elem.setAttribute('id', 'temp-id');
//   elem.setAttribute('onclick', '');
// }

// // Close options menu on outside click
// document.addEventListener('mouseup', e => {
//   if (!expandContainer.contains(e.target)) shrink();
// });

// function shrink() {
//   expandContainer.style.display = 'none';
//   expandContainer.setAttribute('data-value', '0');
//   setTimeout(() => {
//     const temp = document.getElementById('temp-id');
//     if (temp) {
//       temp.setAttribute('onclick', 'expand(this)');
//       temp.removeAttribute('id');
//     }
//   }, 100);
// }

// // Open file
// function openFile(elem) {
//   const path = elem.parentElement.getAttribute('data-file-name');
//   const storageRef = firebase.storage().ref(path);
//   toggleLoader(true);
//   storageRef.getDownloadURL()
//     .then(url => {
//       window.open(url, '_blank');
//       shrink();
//     })
//     .catch(error => console.error(error))
//     .finally(() => toggleLoader(false));
// }

// // Download file
// function downloadFile(elem) {
//   const path = elem.parentElement.getAttribute('data-file-name');
//   const storageRef = firebase.storage().ref(path);
//   toggleLoader(true);
//   storageRef.getDownloadURL()
//     .then(url => {
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = path.split('/')[1];
//       a.style.display = 'none';
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//     })
//     .catch(error => console.error(error))
//     .finally(() => {
//       toggleLoader(false);
//       shrink();
//     });
// }

// // Delete file
// function deleteFile(elem) {
//   const path = elem.parentElement.getAttribute('data-file-name');
//   const storageRef = firebase.storage().ref(path);
//   let metadata = JSON.parse(localStorage.getItem("uploaded-metadata"));
//   const index = metadata.indexOf(path);
//   toggleLoader(true);
//   storageRef.delete()
//     .then(() => {
//       if (index > -1) {
//         metadata.splice(index, 1);
//         localStorage.setItem("uploaded-metadata", JSON.stringify(metadata));
//         showFilesList();
//         shrink();
//       }
//     })
//     .catch(error => console.error(error))
//     .finally(() => toggleLoader(false));
// }

// // Toggle loader visibility
// function toggleLoader(show) {
//   expandContainerUl.style.display = show ? 'none' : 'block';
//   loader.style.display = show ? 'block' : 'none';
// }





















/// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDXhnleVUiVf9Lxid3FUx4PjmXSMa4GG48",
  authDomain: "playground-49b16.firebaseapp.com",
  databaseURL: "https://playground-49b16-default-rtdb.firebaseio.com",
  projectId: "playground-49b16",
  storageBucket: "playground-49b16.appspot.com",
  messagingSenderId: "250708767405",
  appId: "1:250708767405:web:7cdfbccd539f39b8db8c24"
};
firebase.initializeApp(firebaseConfig);

// Sign in anonymously
firebase.auth().signInAnonymously()
  .then(() => console.log("Signed in anonymously"))
  .catch(error => console.error("Sign-in error:", error));

// DOM Elements
const upload = document.querySelector('.upload');
const hiddenBtn = document.querySelector('.hidden-upload-btn');
const progress = document.querySelector('.progress');
const percent = document.querySelector('.percent');
const pause = document.querySelector('.pause');
const resume = document.querySelector('.resume');
const cancel = document.querySelector('.cancel');
const expandContainer = document.querySelector('.expand-container');
const expandContainerUl = expandContainer.querySelector('ul');
const loader = document.querySelector('.loader');

// Init metadata
if (!localStorage.getItem("uploaded-metadata")) {
  localStorage.setItem("uploaded-metadata", JSON.stringify([]));
}

// Trigger hidden file input
upload.onclick = () => hiddenBtn.click();

// Handle file selection
hiddenBtn.onchange = () => {
  const files = hiddenBtn.files;
  if (!files.length) return;
  Array.from(files).forEach(file => uploadFile(file));
};

let currentUploadTask = null;

// ✅ Upload logic with fix
function uploadFile(file) {
  let type = file.type.split('/')[0].toLowerCase();
  const allowedTypes = ['video', 'audio', 'image'];
  if (!allowedTypes.includes(type)) type = 'others';

  const name = `${file.name.split('.').shift()}_${Date.now()}.${file.name.split('.').pop()}`;
  const path = `${type}/${name}`;
  console.log("Uploading to:", path);

  const storageRef = firebase.storage().ref(path);
  const uploadTask = storageRef.put(file);
  currentUploadTask = uploadTask;

  pause.onclick = () => {
    uploadTask.pause();
    pause.style.display = 'none';
    resume.style.display = 'inline-block';
  };
  resume.onclick = () => {
    uploadTask.resume();
    resume.style.display = 'none';
    pause.style.display = 'inline-block';
  };
  cancel.onclick = () => {
    uploadTask.cancel();
    resetProgress();
  };

  upload.disabled = true;
  percent.innerText = '0%';

  uploadTask.on('state_changed',
    snapshot => {
      const progressValue = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      progress.style.width = `${progressValue}%`;
      percent.innerText = `${progressValue}%`;
    },
    error => {
      console.error("Upload error:", error);
      resetProgress();
    },
    () => {
      let metadata = JSON.parse(localStorage.getItem("uploaded-metadata"));
      metadata.unshift(path);
      localStorage.setItem("uploaded-metadata", JSON.stringify(metadata));
      percent.innerText = 'DONE';
      upload.disabled = false;
      hiddenBtn.value = '';
      showFilesList();
    }
  );
}

function resetProgress() {
  progress.style.width = '0%';
  percent.innerText = '0%';
  upload.disabled = false;
  hiddenBtn.value = '';
  pause.style.display = 'inline-block';
  resume.style.display = 'none';
}

window.onload = showFilesList;

function showFilesList() {
  const data = JSON.parse(localStorage.getItem("uploaded-metadata")) || [];

  ['video', 'audio', 'image', 'others'].forEach(type => {
    const container = document.getElementById(type);
    if (container) container.innerHTML = '';
  });

  data.forEach(path => {
    const [folder, fileName] = path.split('/');
    let container = document.getElementById(folder);
    if (!['video', 'audio', 'image'].includes(folder)) {
      container = document.getElementById('others');
    }

    if (container) {
      container.innerHTML += `
        <li data-name="${path}">
          <span>${fileName}</span>
          <svg onclick="expand(this)" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
          </svg>
        </li>
      `;
    }
  });
}

function expand(elem) {
  const path = elem.parentElement.getAttribute('data-name');
  const rect = elem.getBoundingClientRect();
  expandContainer.style.display = 'block';
  expandContainerUl.style.display = 'block';
  loader.style.display = 'none';
  expandContainer.style.left = `${rect.left + window.scrollX - 85}px`;
  expandContainer.style.top = `${rect.top + window.scrollY + 25}px`;
  expandContainer.setAttribute('data-value', '1');
  expandContainerUl.setAttribute('data-file-name', path);
  elem.setAttribute('id', 'temp-id');
  elem.setAttribute('onclick', '');
}

document.addEventListener('mouseup', e => {
  if (!expandContainer.contains(e.target)) shrink();
});

function shrink() {
  expandContainer.style.display = 'none';
  expandContainer.setAttribute('data-value', '0');
  setTimeout(() => {
    const temp = document.getElementById('temp-id');
    if (temp) {
      temp.setAttribute('onclick', 'expand(this)');
      temp.removeAttribute('id');
    }
  }, 100);
}

function openFile(elem) {
  const path = elem.parentElement.getAttribute('data-file-name');
  console.log("Opening file:", path);
  const storageRef = firebase.storage().ref(path);
  toggleLoader(true);
  storageRef.getDownloadURL()
    .then(url => {
      window.open(url, '_blank');
      shrink();
    })
    .catch(error => console.error("Open error:", error))
    .finally(() => toggleLoader(false));
}

function downloadFile(elem) {
  const path = elem.parentElement.getAttribute('data-file-name');
  console.log("Downloading file:", path);
  const storageRef = firebase.storage().ref(path);
  toggleLoader(true);
  storageRef.getDownloadURL()
    .then(url => {
      const a = document.createElement('a');
      a.href = url;
      a.download = path.split('/')[1];
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    .catch(error => console.error("Download error:", error))
    .finally(() => {
      toggleLoader(false);
      shrink();
    });
}

function deleteFile(elem) {
  const path = elem.parentElement.getAttribute('data-file-name');
  console.log("Attempting to delete:", path);

  const storageRef = firebase.storage().ref(path);
  let metadata = JSON.parse(localStorage.getItem("uploaded-metadata")) || [];
  const index = metadata.indexOf(path);
  toggleLoader(true);

  storageRef.delete()
    .then(() => {
      console.log("File deleted:", path);
      if (index > -1) {
        metadata.splice(index, 1);
        localStorage.setItem("uploaded-metadata", JSON.stringify(metadata));
        showFilesList();
        shrink();
      }
    })
    .catch(error => console.error("Delete error:", error))
    .finally(() => toggleLoader(false));
}

function toggleLoader(show) {
  expandContainerUl.style.display = show ? 'none' : 'block';
  loader.style.display = show ? 'block' : 'none';
}


// -------------------------------------------------------------------

function deleteFile(elem) {
  const path = elem.parentElement.getAttribute('data-file-name');
  console.log("Attempting to delete:", path);

  const storageRef = firebase.storage().ref(path);
  let metadata = JSON.parse(localStorage.getItem("uploaded-metadata")) || [];
  const index = metadata.indexOf(path);
  toggleLoader(true);

  storageRef.delete()
    .then(() => {
      console.log("File deleted:", path);
      if (index > -1) {
        metadata.splice(index, 1);
        localStorage.setItem("uploaded-metadata", JSON.stringify(metadata));
        showFilesList();
        shrink();
      }
    })
    .catch(error => {
      console.error("Delete error:", error);

      // 🩹 Fix: if file is not found, clean up localStorage anyway
      if (error.code === 'storage/object-not-found' && index > -1) {
        console.warn("File not found in storage — removing from metadata.");
        metadata.splice(index, 1);
        localStorage.setItem("uploaded-metadata", JSON.stringify(metadata));
        showFilesList();
        shrink();
      }
    })
    .finally(() => toggleLoader(false));
}

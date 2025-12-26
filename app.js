import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdQZ48tFO7ae4BE3damZ3os1nssjXuGlY",
  authDomain: "sahitya-pw-lib2.firebaseapp.com",
  projectId: "sahitya-pw-lib2",
  storageBucket: "sahitya-pw-lib2.firebasestorage.app",
  messagingSenderId: "255256494274",
  appId: "1:255256494274:web:3b8b2ca442f5bfe09cfb5b",
  measurementId: "G-3JJHTRVDW4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); 

const libraryContainer = document.getElementById('library-container');
const submitBtn = document.getElementById('open-submit-btn');
const modalOverlay = document.getElementById('modal-overlay');
const closeBtn = document.getElementById('close-btn');
const poemForm = document.getElementById('poem-form');


submitBtn.addEventListener('click', () => modalOverlay.classList.remove('hidden'));
closeBtn.addEventListener('click', () => modalOverlay.classList.add('hidden'));
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.add('hidden');
});


async function uploadFile(file, path) {
    if (!file) return null; 
    


    const storageRef = ref(storage, path + Date.now() + '-' + file.name);
    

    await uploadBytes(storageRef, file);
    

    return await getDownloadURL(storageRef);
}


poemForm.addEventListener('submit', async (e) => {
    e.preventDefault();


    const submitButton = poemForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerText;
    submitButton.innerText = "Publishing...";
    submitButton.disabled = true;


    const author = document.getElementById('author').value;
    const title = document.getElementById('title').value;
    const body = document.getElementById('poem-body').value;
    const fontChoice = document.getElementById('font-choice').value;
    

    const imageFile = document.getElementById('image-file').files[0];
    const audioFile = document.getElementById('audio-file').files[0];

    try {

        const imageUrl = await uploadFile(imageFile, 'images/');
        const audioUrl = await uploadFile(audioFile, 'audio/');

        await addDoc(collection(db, "poems"), {
            title: title,
            author: author,
            body: body,
            font: fontChoice,
            imageUrl: imageUrl, // Will be null if no image
            audioUrl: audioUrl, // Will be null if no audio
            createdAt: serverTimestamp()
        });

        alert("Poem published!");
        poemForm.reset();
        modalOverlay.classList.add('hidden');
        loadPoems();

    } catch (e) {
        console.error("Error:", e);
        alert("Something went wrong. Check the console.");
    } finally {
        // Reset button
        submitButton.innerText = originalText;
        submitButton.disabled = false;
    }
});


async function loadPoems() {
    libraryContainer.innerHTML = ''; 

    const q = query(collection(db, "poems"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        const card = document.createElement('div');
        card.classList.add('poem-card');
        card.classList.add(data.font);

        // If there is a background image, set it!
        if (data.imageUrl) {
            card.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('${data.imageUrl}')`;
            card.style.backgroundSize = 'cover';
            card.style.backgroundPosition = 'center';
        }

        // Build the HTML content
        let audioHTML = '';
        if (data.audioUrl) {
            audioHTML = `<audio controls src="${data.audioUrl}" style="width: 100%; margin-bottom: 1rem;"></audio>`;
        }

        card.innerHTML = `
            ${audioHTML}
            <div class="poem-title">${data.title}</div>
            <div class="poem-author">by ${data.author}</div>
            <div class="poem-text">${data.body}</div>
        `;

        libraryContainer.appendChild(card);
    });
}

loadPoems();
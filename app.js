import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, onSnapshot, arrayUnion, increment, orderBy, query, Timestamp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";

// --- PASTE YOUR CONFIG HERE ---
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

// DOM Elements
const mainContent = document.getElementById('main-content'); 
const monthList = document.getElementById('month-list');
const submitBtn = document.getElementById('open-submit-btn');
const modalOverlay = document.getElementById('modal-overlay');
const closeBtn = document.getElementById('close-btn');
const poemForm = document.getElementById('poem-form');
const searchBar = document.getElementById('search-bar'); 

// Reader Elements
const readerOverlay = document.getElementById('reader-overlay');
const closeReaderBtn = document.getElementById('close-reader-btn');
const readerTitle = document.getElementById('reader-title');
const readerAuthor = document.getElementById('reader-author');
const readerBody = document.getElementById('reader-body');
const readerDate = document.getElementById('reader-date');
const readerAudio = document.getElementById('reader-audio-container');
const readerContent = document.querySelector('.reader-content');

// Interaction Elements
const reactionZone = document.getElementById('reaction-zone');
const addReactionBtn = document.getElementById('add-reaction-btn');
const emojiPopover = document.getElementById('emoji-popover');
const commentInput = document.getElementById('comment-input');
const postCommentBtn = document.getElementById('post-comment-btn');
const commentsList = document.getElementById('comments-list');

// File Inputs
const imageInput = document.getElementById('image-file');
const audioInput = document.getElementById('audio-file');
const imageLabelText = document.getElementById('image-label-text');
const audioLabelText = document.getElementById('audio-label-text');

// --- 1. GENTLER HEADER SCROLL EFFECT ---
const mainHeader = document.getElementById('main-header');
if (mainHeader) {
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        // Much slower blur: 1px per 100px scroll, max 4px
        const blurValue = Math.min(scrollPos / 100, 4); 
        mainHeader.style.setProperty('--header-blur', `${blurValue}px`);
    });
}

// --- 2. FILE FEEDBACK LOGIC ---
imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        imageLabelText.innerText = "✅ " + e.target.files[0].name;
        imageLabelText.style.fontWeight = "bold";
        imageLabelText.style.color = "#2ecc71";
    }
});

audioInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        audioLabelText.innerText = "✅ " + e.target.files[0].name;
        audioLabelText.style.fontWeight = "bold";
        audioLabelText.style.color = "#2ecc71";
    }
});

// Year Dropdown Setup
const yearSelect = document.getElementById('date-year');
const currentYear = new Date().getFullYear();
for (let i = currentYear; i >= 1990; i--) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerText = i;
    yearSelect.appendChild(opt);
}

// State
let allPoems = [];
let currentPoemId = null; 
let unsubscribePoemListener = null; 

// --- HELPER FUNCTIONS ---
function getMonthYear(timestamp) {
    if (!timestamp) return "Uncategorized";
    const date = timestamp.toDate();
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

async function uploadFile(file, path) {
    if (!file) return null;
    const storageRef = ref(storage, path + Date.now() + '-' + file.name);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
}

// --- LOADING & RENDERING ---
async function loadPoems() {
    mainContent.innerHTML = '<p style="text-align:center; margin-top:2rem;">Loading library...</p>';

    const q = query(collection(db, "poems"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    allPoems = [];
    querySnapshot.forEach((doc) => {
        allPoems.push({ id: doc.id, ...doc.data() });
    });

    renderPoems(allPoems);
}

function renderPoems(poemsToRender) {
    mainContent.innerHTML = ''; 
    monthList.innerHTML = '';

    if (poemsToRender.length === 0) {
        mainContent.innerHTML = '<p style="text-align:center">No poems found.</p>';
        return;
    }

    const groupedPoems = {};
    poemsToRender.forEach(poem => {
        const monthYear = getMonthYear(poem.createdAt);
        if (!groupedPoems[monthYear]) groupedPoems[monthYear] = [];
        groupedPoems[monthYear].push(poem);
    });

    Object.keys(groupedPoems).forEach((month) => {
        const poemsInThisMonth = groupedPoems[month];
        const sectionId = month.replace(/\s+/g, '-');

        const li = document.createElement('li');
        li.innerHTML = `<a href="#${sectionId}">${month}</a>`;
        monthList.appendChild(li);

        const section = document.createElement('section');
        const header = document.createElement('h2');
        header.className = 'month-header';
        header.innerText = month;
        header.id = sectionId; 
        section.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'month-grid'; 

        poemsInThisMonth.forEach(data => {
            const card = document.createElement('div');
            card.classList.add('poem-card', data.font);
            card.onclick = () => openReader(data);

            if (data.imageUrl) {
                card.style.setProperty('--bg-image', `url('${data.imageUrl}')`);
            } else {
                card.style.setProperty('--bg-image', 'none');
            }

            const previewText = data.body.length > 350 ? data.body.substring(0, 350) + "......." : data.body;

            card.innerHTML = `
                <div class="poem-content-wrapper">
                    <div class="poem-title">${data.title}</div>
                    <div class="poem-author">by ${data.author}</div>
                    <div class="poem-text">${previewText}</div>
                </div>
            `;
            grid.appendChild(card);
        });

        section.appendChild(grid);
        mainContent.appendChild(section);
    });
}

// --- READER LOGIC ---
function openReader(data) {
    currentPoemId = data.id; 
    
    readerTitle.innerText = data.title;
    readerAuthor.innerText = `by ${data.author}`;
    readerDate.innerText = getMonthYear(data.createdAt); 
    readerBody.innerText = data.body;
    readerBody.className = `poem-text ${data.font}`;

    if (data.imageUrl) {
        readerContent.style.setProperty('--bg-image', `url('${data.imageUrl}')`);
    } else {
        readerContent.style.setProperty('--bg-image', 'none');
    }

    if (data.audioUrl) {
        readerAudio.innerHTML = `<audio controls src="${data.audioUrl}" style="width: 100%"></audio>`;
    } else {
        readerAudio.innerHTML = '';
    }

    reactionZone.innerHTML = 'Loading reactions...';
    commentsList.innerHTML = '';
    emojiPopover.classList.add('hidden'); 

    readerOverlay.classList.remove('hidden');
    document.body.classList.add('reading-mode'); 

    if (unsubscribePoemListener) unsubscribePoemListener();

    unsubscribePoemListener = onSnapshot(doc(db, "poems", currentPoemId), (docSnap) => {
        if (docSnap.exists()) {
            const liveData = docSnap.data();
            updateReactionsUI(liveData.reactions || {});
            updateCommentsUI(liveData.comments || []);
        }
    });
}

function updateReactionsUI(reactionsObj) {
    reactionZone.innerHTML = '';
    const userVote = localStorage.getItem(`reaction_poem_${currentPoemId}`); 

    for (const [emoji, count] of Object.entries(reactionsObj)) {
        if (count > 0) {
            const tag = document.createElement('button');
            tag.className = 'emoji-tag';
            if (userVote === emoji) tag.classList.add('active');
            tag.innerHTML = `${emoji} <span>${count}</span>`;
            tag.onclick = () => toggleReaction(emoji);
            reactionZone.appendChild(tag);
        }
    }
}

function updateCommentsUI(commentsArray) {
    commentsList.innerHTML = '';
    commentsArray.slice().reverse().forEach(comment => {
        const div = document.createElement('div');
        div.className = 'single-comment';
        div.innerHTML = `
            ${comment.text}
            <span class="comment-date">${new Date(comment.time.seconds * 1000).toLocaleString()}</span>
        `;
        commentsList.appendChild(div);
    });
}

async function toggleReaction(newEmoji) {
    if (!currentPoemId) return;
    const storageKey = `reaction_poem_${currentPoemId}`;
    const previousVote = localStorage.getItem(storageKey);
    const poemRef = doc(db, "poems", currentPoemId);

    if (previousVote === newEmoji) {
        localStorage.removeItem(storageKey);
        await updateDoc(poemRef, { [`reactions.${newEmoji}`]: increment(-1) });
    } else if (previousVote) {
        localStorage.setItem(storageKey, newEmoji);
        await updateDoc(poemRef, {
            [`reactions.${previousVote}`]: increment(-1),
            [`reactions.${newEmoji}`]: increment(1)
        });
    } else {
        localStorage.setItem(storageKey, newEmoji);
        await updateDoc(poemRef, { [`reactions.${newEmoji}`]: increment(1) });
    }
}

addReactionBtn.onclick = (e) => {
    e.stopPropagation(); 
    emojiPopover.classList.toggle('hidden');
};

document.querySelector('emoji-picker').addEventListener('emoji-click', event => {
    const emoji = event.detail.unicode;
    toggleReaction(emoji);
    emojiPopover.classList.add('hidden');
});

postCommentBtn.onclick = async () => {
    const text = commentInput.value.trim();
    if (!text || !currentPoemId) return;

    postCommentBtn.disabled = true;
    postCommentBtn.innerText = "Posting...";

    const newComment = { text: text, time: Timestamp.now() };
    const poemRef = doc(db, "poems", currentPoemId);
    await updateDoc(poemRef, { comments: arrayUnion(newComment) });

    commentInput.value = ''; 
    postCommentBtn.disabled = false;
    postCommentBtn.innerText = "Post";
};

function closeReader() {
    readerOverlay.classList.add('hidden');
    document.body.classList.remove('reading-mode');
    if (unsubscribePoemListener) {
        unsubscribePoemListener();
        unsubscribePoemListener = null;
    }
}

closeReaderBtn.addEventListener('click', closeReader);
readerOverlay.addEventListener('click', (e) => {
    if (e.target === readerOverlay) closeReader();
});

submitBtn.addEventListener('click', () => modalOverlay.classList.remove('hidden'));
closeBtn.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
    imageLabelText.innerText = "📷 Add Background Image (Optional)";
    imageLabelText.style.color = "#666";
    audioLabelText.innerText = "🎙️ Add Voice Recording (Optional)";
    audioLabelText.style.color = "#666";
});

poemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = poemForm.querySelector('button[type="submit"]');
    submitButton.innerText = "Publishing...";
    submitButton.disabled = true;

    const author = document.getElementById('author').value;
    const title = document.getElementById('title').value;
    const body = document.getElementById('poem-body').value;
    const fontChoice = document.getElementById('font-choice').value;
    const month = document.getElementById('date-month').value;
    const year = document.getElementById('date-year').value;
    const imageFile = imageInput.files[0];
    const audioFile = audioInput.files[0];

    let timestamp;
    if (month && year) {
        const dateString = `${month} 1, ${year}`;
        timestamp = Timestamp.fromDate(new Date(dateString));
    } else {
        timestamp = Timestamp.now();
    }

    try {
        const imageUrl = await uploadFile(imageFile, 'images/');
        const audioUrl = await uploadFile(audioFile, 'audio/');

        await addDoc(collection(db, "poems"), {
            title, author, body, font: fontChoice, imageUrl, audioUrl,
            createdAt: timestamp, reactions: {}, comments: [] 
        });

        alert("Poem published!");
        poemForm.reset();
        modalOverlay.classList.add('hidden');
        imageLabelText.innerText = "📷 Add Background Image (Optional)";
        imageLabelText.style.color = "#666";
        loadPoems();
    } catch (e) {
        console.error(e);
        alert("Error submitting.");
    } finally {
        submitButton.innerText = "Publish";
        submitButton.disabled = false;
    }
});

searchBar.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allPoems.filter(p => 
        p.title.toLowerCase().includes(term) || 
        p.author.toLowerCase().includes(term) ||
        p.body.toLowerCase().includes(term)
    );
    renderPoems(filtered);
});

// --- DARK MODE LOGIC ---
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggleBtn.innerText = '☀️';
}

themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.innerText = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggleBtn.innerText = '🌙';
    }
});

loadPoems();
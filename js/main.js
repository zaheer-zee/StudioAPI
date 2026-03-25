import { fetchDogImage, extractBreedFromUrl } from './api/dog.js';
import { fetchJoke } from './api/joke.js';
import { fetchRandomUser } from './api/user.js';
import { fetchLatestPost } from './api/posts.js';

// --- Utility Functions ---
const setLoader = (buttonId, isLoading, originalText = '') => {
    const btn = document.getElementById(buttonId);
    if (!btn) return;
    
    if (isLoading) {
        btn.disabled = true;
        btn.classList.add('loading');
        btn.textContent = 'Processing...';
    } else {
        btn.disabled = false;
        btn.classList.remove('loading');
        btn.textContent = originalText;
    }
};

const showError = (elementId, message) => {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.classList.remove('hidden');
        setTimeout(() => { el.textContent = ''; }, 5000); // Clear error after 5s
    }
};

// --- Dog API Implementation ---
const initDogAPI = () => {
    const btnDiscover = document.getElementById('btn-dog');
    const container = document.getElementById('dog-img-container');
    const placeholder = document.getElementById('dog-placeholder');
    const breedText = document.getElementById('dog-breed');
    const btnCopy = document.getElementById('btn-copy-dog');
    let currentDogUrl = '';

    btnDiscover.addEventListener('click', async () => {
        try {
            setLoader('btn-dog', true, 'Discover');
            const imageUrl = await fetchDogImage();
            currentDogUrl = imageUrl;
            
            // Extract Breed
            const breedName = extractBreedFromUrl(imageUrl);
            
            // Build image element
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `A beautiful ${breedName}`;
            img.onload = () => setLoader('btn-dog', false, 'Discover');
            
            // Clear existing and inject new
            container.innerHTML = '';
            container.appendChild(img);
            
            // Update UI
            breedText.textContent = breedName;
            btnCopy.classList.remove('hidden');
        } catch (error) {
            setLoader('btn-dog', false, 'Discover');
            showError('dog-error', error.message);
        }
    });

    btnCopy.addEventListener('click', async () => {
        if (!currentDogUrl) return;
        try {
            await navigator.clipboard.writeText(currentDogUrl);
            const originalText = btnCopy.textContent;
            btnCopy.textContent = 'Copied!';
            setTimeout(() => { btnCopy.textContent = originalText; }, 2000);
        } catch (err) {
            showError('dog-error', 'Failed to copy to clipboard.');
        }
    });
};

// --- Joke API Implementation ---
const initJokeAPI = () => {
    const btnGenerate = document.getElementById('btn-joke');
    const btnNext = document.getElementById('btn-next-joke');
    const setupText = document.getElementById('joke-setup');
    const punchlineText = document.getElementById('joke-punchline');

    const handleJokeFetch = async (btnId, originalText) => {
        try {
            setLoader(btnId, true, originalText);
            const joke = await fetchJoke();
            
            setupText.textContent = joke.setup;
            punchlineText.textContent = joke.punchline;
            
            // Reveal next button if not visible
            if (btnNext.classList.contains('hidden')) {
                btnNext.classList.remove('hidden');
                btnGenerate.classList.add('hidden'); // Optional: hide the primary button once started
            }
        } catch (error) {
            showError('joke-error', error.message);
        } finally {
            setLoader(btnId, false, originalText);
        }
    };

    btnGenerate.addEventListener('click', () => handleJokeFetch('btn-joke', 'Generate'));
    btnNext.addEventListener('click', () => handleJokeFetch('btn-next-joke', 'Next Iteration'));
};

// --- User API Implementation ---
const initUserAPI = () => {
    const btnRetrieve = document.getElementById('btn-user');
    const nameText = document.getElementById('user-name');
    const emailText = document.getElementById('user-email');
    const countryText = document.getElementById('user-country');
    const ageText = document.getElementById('user-age');
    const avatarImg = document.getElementById('user-avatar');
    const placeholder = document.getElementById('user-avatar-placeholder');

    btnRetrieve.addEventListener('click', async () => {
        try {
            setLoader('btn-user', true, 'Retrieve');
            const user = await fetchRandomUser();
            
            nameText.textContent = `${user.name.first} ${user.name.last}`;
            emailText.textContent = user.email;
            countryText.textContent = user.location.country;
            ageText.textContent = `${user.dob.age} years`;
            
            // Handle image load
            avatarImg.src = user.picture.large;
            avatarImg.onload = () => {
                placeholder.classList.add('hidden');
                avatarImg.classList.remove('hidden');
            };
        } catch (error) {
            showError('user-error', error.message);
        } finally {
            setLoader('btn-user', false, 'Retrieve');
        }
    });
};

// --- Post JSONPlaceholder API Implementation ---
const initPostAPI = () => {
    const btnPost = document.getElementById('btn-post');
    const titleText = document.getElementById('post-title');
    const bodyText = document.getElementById('post-body');

    btnPost.addEventListener('click', async () => {
        try {
            setLoader('btn-post', true, 'Decode');
            const post = await fetchLatestPost();
            
            titleText.textContent = post.title;
            bodyText.textContent = post.body;
        } catch (error) {
            showError('post-error', error.message);
        } finally {
            setLoader('btn-post', false, 'Decode');
        }
    });
};

// Initialize everything when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initDogAPI();
    initJokeAPI();
    initUserAPI();
    initPostAPI();
});

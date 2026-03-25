export async function fetchJoke() {
    const response = await fetch('https://official-joke-api.appspot.com/random_joke');
    if (!response.ok) {
        throw new Error('Humor engine offline. Could not generate.');
    }
    return await response.json();
}

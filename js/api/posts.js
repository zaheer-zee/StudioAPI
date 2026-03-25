export async function fetchLatestPost() {
    // Generate a random post ID between 1 and 100 to make it dynamic
    const randomId = Math.floor(Math.random() * 100) + 1;
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${randomId}`);
    
    if (!response.ok) {
        throw new Error('Transmission intercepted. Post retrieval failed.');
    }
    
    return await response.json();
}

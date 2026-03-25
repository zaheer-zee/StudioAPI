export async function fetchLatestPost() {
    const response = await fetch('https://api.quotable.io/random');
    
    if (!response.ok) {
        throw new Error('Transmission intercepted. Post retrieval failed.');
    }
    
    const data = await response.json();

    // Map to the shape main.js expects: { title, body }
    return {
        title: data.author,
        body: data.content,
    };
}

export async function fetchRandomUser() {
    const response = await fetch('https://randomuser.me/api/');
    if (!response.ok) {
        throw new Error('Database access denied. Persona retrieval failed.');
    }
    const data = await response.json();
    return data.results[0];
}

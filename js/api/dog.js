export async function fetchDogImage() {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    if (!response.ok) {
        throw new Error('Signal lost. Failed to fetch canine data.');
    }
    const data = await response.json();
    return data.message;
}

export function extractBreedFromUrl(url) {
    try {
        const parts = url.split('/');
        const breedIndex = parts.indexOf('breeds') + 1;
        let breed = parts[breedIndex];
        
        // Handle sub-breeds (e.g., hound-afghan)
        if (breed.includes('-')) {
            breed = breed.split('-').reverse().join(' ');
        }
        
        // Capitalize words
        return breed.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    } catch (e) {
        return 'Unknown Breed';
    }
}

// Helper functions for saving/loading JSON data in localStorage


//  Save any JS value to localStorage as JSON.
 

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

//  Load JSON from localStorage.
//  Returns [] (empty array) if nothing exists.


function loadData(key) {
    const data = localStorage.getItem(key);
    try {
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error parsing JSON from localStorage:", key);
        return [];
    }
}


// Generate unique numeric ID using timestamp.
function generateId() {
    return Date.now() + Math.random();
}

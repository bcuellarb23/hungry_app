document.getElementById('searchButton').addEventListener('click', () => {
    const foodItem = document.getElementById('foodInput').value;
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (!foodItem) {
        resultsContainer.innerHTML = '<p class="error">Please enter a food item.</p>';
        return;
    }

    // Construct the URL for a GET request with a query parameter
    const backendUrl = `${API_BASE_URL}/search_food?food_item=${encodeURIComponent(foodItem)}`;

    fetch(backendUrl)
        .then(response => {
            // Check for HTTP errors
            if (!response.ok) {
                // If the response is not OK, assume a "not found" message
                return response.json().then(error => {
                    throw new Error(error.message);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                resultsContainer.innerHTML = `<p>No food found for "${foodItem}".</p>`;
            } else {
                let html = '<h2>Search Results</h2>';
                data.forEach(item => {
                    html += `
                        <div class="food-item">
                            <h3>${item.product_name}</h3>
                            <ul>
                                <li><strong>Calories:</strong> ${item.calories} kcal</li>
                                <li><strong>Proteins:</strong> ${item.proteins} g</li>
                                <li><strong>Fat:</strong> ${item.fat} g</li>
                                <li><strong>Carbohydrates:</strong> ${item.carbohydrates} g</li>
                                <li><strong>Sugars:</strong> ${item.sugars} g</li>
                            </ul>
                        </div>
                    `;
                });
                resultsContainer.innerHTML = html;
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            resultsContainer.innerHTML = `<p class="error">${error.message || 'An error occurred while fetching data.'}</p>`;
        });
});
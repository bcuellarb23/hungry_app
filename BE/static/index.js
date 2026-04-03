document.addEventListener('DOMContentLoaded', async() => {

    const searchButton = document.getElementById('searchButton');
    const foodInput = document.getElementById('foodInput');
    const resultsDiv = document.getElementById('results');

    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    async function performSearch() {

        const foodItem = foodInput.value;
        if (!foodItem) return;
        
        resultsDiv.innerHTML = 'Searching...';
        console.log(`Searching for: ${foodItem} at ${API_BASE_URL}/search_food`);

        try {
            const response = await fetch(`${API_BASE_URL}/search_food?food_item=${encodeURIComponent(foodItem)}`, {
                credentials: 'include'
            });
            const products = await response.json();

            resultsDiv.innerHTML = ''; // Clear previous results

            if (response.ok && products.length > 0) {
                const template = document.getElementById('result-template');

                products.forEach(product => {
                    const clone = template.content.cloneNode(true);

                    clone.querySelector('h2').textContent = product.product_name;
                    clone.querySelector('.p-cals').textContent = `Calories: ${product.calories} kcal`;
                    clone.querySelector('.p-prot').textContent = `Proteins: ${product.proteins}g`;
                    clone.querySelector('.p-carbs').textContent = `Carbohydrates: ${product.carbohydrates}g`;
                    clone.querySelector('.p-fats').textContent = `Fats: ${product.fat}g`;

                    resultsDiv.appendChild(clone);
                });
            } else {
                resultsDiv.textContent = 'No food items found.';
            }
        } catch (error) {
            console.error('Error fetching food data:', error);
            resultsDiv.textContent = 'An error occurred while searching.';
        }
    }
});

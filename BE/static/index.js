document.addEventListener('DOMContentLoaded', async() => {

    const searchButton = document.getElementById('searchButton');
    const foodInput = document.getElementById('foodInput');
    const resultsDiv = document.getElementById('results');

    if (searchButton) {
        searchButton.addEventListener('click', async () => {
        const foodItem = foodInput.value;
        if (foodItem) {
            try {
                const response = await fetch(`${API_BASE_URL}/search_food?food_item=${encodeURIComponent(foodItem)}`);
                const products = await response.json();
                
                resultsDiv.innerHTML = ''; // Clear previous results
                if (response.ok && products.length > 0) {
                    products.forEach(product => {
                        const productDiv = document.createElement('div');
                        productDiv.classList.add('product-result');
                        productDiv.innerHTML = `
                            <h4>${product.product_name}</h4>
                            <p>Calories: ${product.calories} kcal</p>
                            <p>Proteins: ${product.proteins}g</p>
                            <p>Carbohydrates: ${product.carbohydrates}g</p>
                            <p>Fats: ${product.fat}g</p>
                            <button class="add-food-btn" 
                                data-name="${product.product_name}" 
                                data-calories="${product.calories}" 
                                data-proteins="${product.proteins}" 
                                data-carbs="${product.carbohydrates}"
                                data-fat="${product.fat}">Add</button>
                        `;
                        resultsDiv.appendChild(productDiv);
                    });
                    
                    document.querySelectorAll('.add-food-btn').forEach(button => {
                        button.addEventListener('click', async (event) => {
                            const foodData = {
                                product_name: event.target.getAttribute('data-name'),
                                calories: parseFloat(event.target.getAttribute('data-calories')),
                                proteins: parseFloat(event.target.getAttribute('data-proteins')),
                                carbohydrates: parseFloat(event.target.getAttribute('data-carbs')),
                                fat: parseFloat(event.target.getAttribute('data-fat'))

                            };

                            await addFoodEntry(foodData);
                          
                        });
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
    }
});

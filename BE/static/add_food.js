document.addEventListener('DOMContentLoaded', async() => {
    const foodInput = document.getElementById('foodInput');
    const searchButton = document.getElementById('searchButton');
    const resultsDiv = document.getElementById('results');
    const addManuallyBtn = document.getElementById('addManuallyBtn');

    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    if (addManuallyBtn) {
        addManuallyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resultsDiv.innerHTML = ''; // Clear search results

            const template = document.getElementById('Add-manually');
            const clone = template.content.cloneNode(true);
            
            const form = clone.querySelector('#manual-food-form');
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                
                const formData = new FormData(form);
                const foodData = {
                    product_name: formData.get('name'),
                    calories: parseFloat(formData.get('calories')),
                    proteins: parseFloat(formData.get('proteins')),
                    carbohydrates: parseFloat(formData.get('carbs')),
                    fat: parseFloat(formData.get('fats')),
                    serving_size: parseFloat(formData.get('serving_size')) || 100
                };

                await addFoodEntry(foodData);
            });

            resultsDiv.appendChild(clone);
        });
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

                    const input = clone.querySelector('.serving-size-input');

                    const btn = clone.querySelector('.add-food-btn');
                    btn.addEventListener('click', async () => {
                        const foodData = {
                            product_name: product.product_name,
                            calories: product.calories,
                            proteins: product.proteins,
                            carbohydrates: product.carbohydrates,
                            fat: product.fat,
                            serving_size: parseFloat(input.value) || 100,
                        };
                        await addFoodEntry(foodData);
                    });

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

    async function addFoodEntry(foodData) {
        try {
            const response = await fetch(`${API_BASE_URL}/add_food`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(foodData),
                credentials: 'include'
            });

            const result = await response.json();
            if (response.ok) {
                alert('Food added to your daily log!');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (err) {
            console.error('Failed to post food entry:', err);
        }
    }
    
});

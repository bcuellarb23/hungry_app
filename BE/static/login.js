
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('login-form');
    const messageDiv = document.getElementById('message');

    if (!form) {
	    console.error('Login form not found! Make sure your form has the correct id');
	    return;
    }

    form.addEventListener('submit', async (e) => {
	    e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) { // Check if the response status is 200
                    	messageDiv.style.color = 'green';
			            messageDiv.textContent = `Success: ${result.message}`;

                    	// Redirect the user to the main page on successful login
			            setTimeout(() => {
				        window.location.href = '/home';
                    	}, 2000); // Redirects after 2 seconds
                 } else {
                    	// Login failed, show the error message from the server
                    	messageDiv.style.color = 'red';
			            messageDiv.textContent = `Error: ${result.message}`;
                
                } }
            
                catch (error) {
                    console.error('Error:', error);
                    messageDiv.textContent = 'An error occurred during login. Please try again.';
                    messageDiv.style.color = 'red';
                }
    
    });
});

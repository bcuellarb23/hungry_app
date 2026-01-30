
document.addEventListener('DOMContentLoaded', () => {
	// This was taken form the form ID 
    const form = document.getElementById('signup-form');
    const messageDiv = document.getElementById('message');

	if (!form) {
		console.error('Signup form not found! Make sure your form has id="signup-form".');
		return;
	}
	form.addEventListener('submit', async (e) => {
       		e.preventDefault();

			// Use formData Constructor to take all form automatically 
       		const formData = new FormData(form);
			const data = Object.fromEntries(formData.entries());
			//check if password is ==
        	const password = data.password;
        	const confirmPassword = data['confirm-password'];

        	if (password !== confirmPassword) {
            		messageDiv.style.color = 'red';
            		messageDiv.textContent = 'Error: Passwords do not match.';
            		return;
        	}

        	const payload = {
			...data,
            		age: parseInt(data.age, 10),
        	    	weight: parseFloat(data.weight),
            		height: parseFloat(data.height)
        	};

        	try {
            		const response = await fetch(`${API_BASE_URL}/profile`, {
                		method: 'POST',
                		headers: {
                    			'Content-Type': 'application/json',
               			},
                		body: JSON.stringify(payload),
            		});

            		const result = await response.json();

            		if (response.ok) {
                		messageDiv.style.color = 'green';
      					messageDiv.textContent = `Success: ${result.message} Your TDEE is ${result.tdee} calories. Redirecting...`;
                
                		// Redirect to /home page after a short delay
               			setTimeout(() => {
                    			window.location.href = '/home';
                		}, 2000); // Redirects after 2 seconds

            		} else {
		    		//if not success display error
                		messageDiv.style.color = 'red';
                		messageDiv.textContent = `Error: ${result.message}`;
            		}
			} catch (error) {
            		messageDiv.style.color = 'red';
            		messageDiv.textContent = 'An unexpected error occurred. Check your server.';
            		console.error('Error:', error);
        	}
    });
});
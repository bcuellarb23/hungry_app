document.addEventListener('DOMContentLoaded', () => {
    const viewSection = document.getElementById('profile-view-section');
    const editSection = document.getElementById('profile-edit-section');
    const editForm = document.getElementById('edit-profile-form');
    const profileDisplay = document.getElementById('profile-display');
    const imageUpload = document.getElementById('image-upload');
    const userNameDisplay = document.getElementById('user-name-display');

    // Store non-editable data needed for TDEE recalculation
    let cachedProfileData = {};

    // Buttons
    const editBtn = document.getElementById('enable-edit-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');

    // 1. Fetch initial data
    async function loadProfileData() {
        try {
            // Note: You should update app.py to return all metrics in this call or a new one
            const response = await fetch(`${API_BASE_URL}/get_info`, { credentials: 'include' });
            const data = await response.json();

            if (data.status === 'success') {
                cachedProfileData = data;
                userNameDisplay.textContent = data.user_name;
                
                // Fill View Mode
                document.getElementById('display-age').textContent = data.age || '--';
                document.getElementById('display-weight').textContent = data.weight || '--';
                if (data.height) {
                    const ft = Math.floor(data.height / 12);
                    const inches = Math.round(data.height % 12);
                    document.getElementById('display-height').textContent = `${ft}' ${inches}"`;
                    
                    // Fill Edit Form
                    document.getElementById('edit-height-ft').value = ft;
                    document.getElementById('edit-height-in').value = inches;
                }
                document.getElementById('display-goal').textContent = data.goals || '--';
                document.getElementById('display-activity').textContent = data.activity || '--';

                // Fill Edit Form
                document.getElementById('edit-name').value = data.user_name;
                document.getElementById('edit-age').value = data.age || '';
                document.getElementById('edit-weight').value = data.weight || '';
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    // 2. Image Modification (Preview)
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profileDisplay.src = event.target.result;
            };
            reader.readAsDataURL(file);
            
            // Note: To save the image, you would need to fetch() to a POST upload endpoint here
            console.log("Image selected. Ready to upload to server.");
        }
    });

    // 3. Toggle View/Edit
    editBtn.addEventListener('click', () => {
        viewSection.style.display = 'none';
        editSection.style.display = 'block';
    });

    cancelBtn.addEventListener('click', () => {
        editSection.style.display = 'none';
        viewSection.style.display = 'block';
    });

    // 4. Handle Form Submission
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(editForm);
        const payload = Object.fromEntries(formData.entries());

        // Merge with cached data to ensure backend has gender/goals/activity for TDEE
        payload.gender = cachedProfileData.gender;
        payload.goals = cachedProfileData.goals;
        payload.activity = cachedProfileData.activity;
        payload.difficulty = cachedProfileData.difficulty || 'intermediate';

        // Convert numbers
        payload.age = parseInt(payload.age);
        payload.weight = parseFloat(payload.weight);
        payload.height = (parseInt(payload.height_ft, 10) * 12) + (parseFloat(payload.height_in) || 0);

        try {
            // Reusing your save_profile logic from app.py
            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            const result = await response.json();
            if (response.ok) {
                alert('Profile updated successfully!');
                window.location.reload(); // Refresh to update view mode
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to save changes.');
        }
    });

    loadProfileData();
});

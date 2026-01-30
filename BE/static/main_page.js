
document.addEventListener('DOMContentLoaded', async () => {
    
    function setDates() {
        
        // Get the current date
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(today.getDate()).padStart(2, '0');
        
        const formattedDate = `${month}/${day}/${year}`;

        // Get yesterday's date
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayYear = yesterday.getFullYear();
        const yesterdayMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
        const yesterdayDay = String(yesterday.getDate()).padStart(2, '0');

        const formattedYesterday = `${yesterdayMonth}/${yesterdayDay}/${yesterdayYear}`;

        // Get tomorrow's date
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowYear = tomorrow.getFullYear();
        const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const tomorrowDay = String(tomorrow.getDate()).padStart(2, '0');

        const formattedTomorrow = `${tomorrowMonth}/${tomorrowDay}/${tomorrowYear}`;

        // Get the day after tomorrow's date
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(today.getDate() + 2);
        const dayAfterTomorrowYear = dayAfterTomorrow.getFullYear();
        const dayAfterTomorrowMonth = String(dayAfterTomorrow.getMonth() + 1).padStart(2, '0');
        const dayAfterTomorrowDay = String(dayAfterTomorrow.getDate()).padStart(2, '0');

        const formattedDayAfterTomorrow = `${dayAfterTomorrowMonth}/${dayAfterTomorrowDay}/${dayAfterTomorrowYear}`;

        // Update the HTML content
        document.getElementById('week').textContent = `Week ${formattedYesterday} to ${formattedDayAfterTomorrow}`;
        document.getElementById('yesterday-date').textContent = `Yesterday ${formattedYesterday}`;
        document.getElementById('today-date').textContent = `Today ${formattedDate}`;
        document.getElementById('tomorrow-date').textContent = `Tomorrow ${formattedTomorrow}`;
        document.getElementById('day-after-tomorrow-date').textContent = `The day after ${formattedDayAfterTomorrow}`;
    }

    // Function to fetch and display TDEE
    async function fetchTDEE() {
        try {
            const response = await fetch(`${API_BASE_URL}/get-tdee`, {credentials: 'include'});
            if (response.ok) {
                const data = await response.json();
                if (data.status === "success") {
                    const tdeeElement = document.getElementById('tdee-value');
                    if (tdeeElement) {
                        tdeeElement.textContent = `(${data.tdee} Kcal)`;
                    }
                }
            } else {
                console.error('Failed to fetch TDEE from API.');
            }
        } catch (error) {
            console.error('An error occurred while fetching TDEE:', error);
        }
    }

    // Call all the function when the page loads
    setDates();
    fetchTDEE();

    // profile info
    const userNameDiv = document.querySelector('.user-name');

    async function fetchUserName() {
        // function for info
        try {
        //username
            const response = await fetch(`${API_BASE_URL}/get_info`, {
                credentials: 'include' // Include cookies for session management
            });
            const data = await response.json();

            if (data.status === "success" && userNameDiv) {
                userNameDiv.textContent = data.user_name;
            } else {
                console.error('failed to retrieve username:', data.message);
                userNameDiv.textContent = "Guest";
            }
        } catch (error) {
        console.error('An error occurred while fetching username:', error);
        userNameDiv.textContent = "Guest";
        }
    }
    fetchUserName();
});
// Create a div element to hold the floating content
const floatingTableDiv = document.createElement('div');
floatingTableDiv.classList.add('floating-text'); // Add a class for styling

// Fetch the table HTML from the external file
fetch(chrome.runtime.getURL('table.html'))
    .then(response => response.text())
    .then(data => {
        // Insert the HTML content from table.html into the floating div
        floatingTableDiv.innerHTML = data;

        // Append the div to the body
        document.body.appendChild(floatingTableDiv);
    })
    .catch(error => console.error('Error loading the table:', error));

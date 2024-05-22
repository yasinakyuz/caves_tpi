document.addEventListener('DOMContentLoaded', function() {
    fetchMessages();
});

function fetchMessages() {
    fetch('/Backend/getMessages.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayMessages(data.messages);
            } else {
                console.error('Failed to fetch messages:', data.error);
                alert('Failed to fetch messages: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while fetching messages');
        });
}

function displayMessages(messages) {
    const messagesList = document.getElementById('messages-list');
    messagesList.innerHTML = '';

    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message-item');
        messageDiv.innerHTML = `
            <strong>${message.title}</strong> - from ${message.firstname} ${message.name}
            <p>${message.message_text}</p>
            <small>Sent: ${new Date(message.sent_time).toLocaleString()}</small>
        `;
        messagesList.appendChild(messageDiv);
    });
}
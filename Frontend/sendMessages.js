document.getElementById('send-message-btn').addEventListener('click', sendMessage);
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    if (!messageInput) {
        console.error('Message input element not found');
        return;
    }
    const message = messageInput.value;
    if (message.trim() === '') {
        alert('Message cannot be empty');
        return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const announcement_id = urlParams.get('id');
    const buyer_id = getCurrentUserId();

    if (!announcement_id || !buyer_id) {
        console.error('L ID d annonce ou l ID d acheteur est manquant');
        alert('Échec de l envoi du message: données d entrée non valides');
        return;
    }

    fetch('/Backend/sendMessages.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message, announcement_id, buyer_id })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                messageInput.value = '';
                appendMessageToChat(data.message);
            } else {
                alert('Échec de l envoi du message: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Une erreur s est produite pendant l envoi du message');
        });
}
function appendMessageToChat(message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');
    messageContainer.textContent = message;
    document.getElementById('messages-container').appendChild(messageContainer);
}
function getCurrentUserId() {
    // Implement this function to get the buyer ID, for example, from a session or a global variable
    return 1; // Placeholder value, replace with actual logic
}


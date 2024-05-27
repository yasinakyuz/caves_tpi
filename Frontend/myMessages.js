
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
                console.error('Échec de la récupération des messages:', data.error);
                alert('Échec de la récupération des messages: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Une erreur s est produite lors de la récupération des messages');
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
            <button onclick="toggleReplyForm('${message.ad_id}', '${message.name}')">Reply</button>
            <div id="reply-${message.ad_id}" class="reply-form" style="display:none;">
                <textarea id="reply-text-${message.ad_id}"></textarea>
                <button onclick="sendReply(${message.ad_id}, '${message.buyer_id}')">Send Reply</button>
            </div>
        `;
        messagesList.appendChild(messageDiv);
    });
}

function toggleReplyForm(adId, name) {
    const replyForm = document.getElementById(`reply-${adId}`);
    replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
}

function sendReply(adId, originalBuyerId) {
    const replyText = document.getElementById(`reply-text-${adId}`).value;
    if (!replyText.trim()) {
        alert("Veuillez saisir un message de réponse.");
        return;
    }

    //const buyerId = originalBuyerId;

    const data = JSON.stringify({

        announcement_id: adId,
        message: replyText,
        buyer_id :originalBuyerId,
        //original_buyer_id: buyer_Id, // This is the ID of the user who initially sent the message.
        reply: true  // This marks the message as a reply
    });

    fetch('/Backend/sendMessages.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Réponse envoyée avec succès');
                document.getElementById(`reply-text-${adId}`).value = ''; // Clear the textarea
            } else {
                console.error('Échec de l envoi de la réponse:', data.error);
                alert('Échec de l envoi de la réponse: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Une erreur s\'est produite lors de l envoi de la réponse');
        });
}

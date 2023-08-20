async function connectWebSocket() {
    await eel.start_websocket()();
    updateMessages();
}

function updateMessages() {
    let messages = eel.get_received_messages()();
    let output = document.getElementById('output');
    output.innerHTML = "Datos recibidos: " + JSON.stringify(messages);
}

// Actualizar cada segundo
setInterval(updateMessages, 1000);

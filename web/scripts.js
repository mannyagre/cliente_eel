async function connectWebSocket() {
    await eel.start_websocket()();
    await updateMessages();
}

async function updateMessages() {
    let messages = await eel.get_received_messages()();
    
    // Limpiar gráficas e información anteriores
    let chartContainer = document.getElementById('chart-container');
    chartContainer.innerHTML = '';

    // Crear una sección para cada agente
    messages.forEach((agentData, index) => {
        let ip = agentData['Info general']['IP'];

        // Crear un contenedor para el agente
        let agentContainer = document.createElement('div');
        agentContainer.className = 'agent-container';
        chartContainer.appendChild(agentContainer);

        // Añadir información textual
        let infoText = `
            <h3>Agente ${ip}</h3>
            <p>Hostname: ${agentData['Info general']['Hostname']}</p>
            <p>MAC Address: ${agentData['Info general']['MAC address']}</p>
            <p>Temperatura CPU: ${agentData['Procesador']['Temperatura']}</p>
        `;
        agentContainer.innerHTML = infoText;

        // Crear un elemento canvas para la gráfica
        let canvas = document.createElement('canvas');
        canvas.id = `chart-${ip}`;
        agentContainer.appendChild(canvas);

        // Datos para la gráfica
        let labels = ['Uso de CPU', 'RAM Usada', 'RAM Disponible', 'Almacenamiento Usado'];
        let data = [
            parseFloat(agentData['Procesador']['Uso de CPU']),
            parseFloat(agentData['Memoria RAM']['Usada']),
            parseFloat(agentData['Memoria RAM']['Disponible']),
            parseFloat(agentData['Almacenamiento']['Usado'])
        ];

        // Crear la gráfica
        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: `Agente ${ip}`,
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            }
        });
    });
}

// Actualizar cada segundo
setInterval(async () => {
    await updateMessages();
}, 1000);

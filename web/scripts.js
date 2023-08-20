let agentDataHistory = {};

async function connectWebSocket() {
    await eel.start_websocket()();
    await updateMessages();
}

async function updateMessages() {
    let messages = await eel.get_received_messages()();
    let chartContainer = document.getElementById('chart-container');

    messages.forEach((agentData) => {
        let hostname = agentData['Info general']['Hostname'];
        let ip = agentData['Info general']['IP'];

        // Inicializar el historial de datos para el agente si es necesario
        if (!agentDataHistory[hostname]) {
            agentDataHistory[hostname] = {
                'CPU Temp': [],
                'Motherboard Temp': [],
                'CPU Usage': [],
                'RAM Used': [],
                'RAM Available': [],
                'Storage Used': []
            };
        }

        // Actualizar el historial de datos
        for (let metric in agentDataHistory[hostname]) {
            let value = 0;
            switch (metric) {
                case 'CPU Temp': value = agentData['Procesador']['Temperatura']; break;
                case 'Motherboard Temp': value = agentData['Tarjeta Madre']['Temperatura']; break;
                case 'CPU Usage': value = agentData['Procesador']['Uso de CPU']; break;
                case 'RAM Used': value = agentData['Memoria RAM']['Usada']; break;
                case 'RAM Available': value = agentData['Memoria RAM']['Disponible']; break;
                case 'Storage Used': value = agentData['Almacenamiento']['Usado']; break;
            }
            agentDataHistory[hostname][metric].push(parseFloat(value));
        }

        // Crear o actualizar el contenedor del agente
        let agentContainer = document.getElementById(`agent-${hostname}`);
        if (!agentContainer) {
            agentContainer = document.createElement('div');
            agentContainer.id = `agent-${hostname}`;
            agentContainer.className = 'agent-container';
            chartContainer.appendChild(agentContainer);
        }

        // Actualizar la información textual
        let infoContainer = document.getElementById(`info-${hostname}`);
        if (!infoContainer) {
            infoContainer = document.createElement('div');
            infoContainer.id = `info-${hostname}`;
            agentContainer.appendChild(infoContainer);
        }
        infoContainer.innerHTML = `
            <h3>Agente ${hostname}</h3>
            <p>IP: ${ip}</p>
            <p>MAC Address: ${agentData['Info general']['MAC address']}</p>
            <p>CPU: ${agentData['Procesador']['Nombre']}</p>
            <p>Motherboard: ${agentData['Tarjeta Madre']['Nombre']}</p>
        `;

        // Crear o actualizar las gráficas
        for (let metric in agentDataHistory[hostname]) {
            let chartId = `chart-${hostname}-${metric.replace(/ /g, '-')}`;
            let chartDiv = document.getElementById(chartId);
            if (!chartDiv) {
                chartDiv = document.createElement('div');
                chartDiv.id = chartId;
                agentContainer.appendChild(chartDiv);
            }

            Highcharts.chart(chartId, {
                title: {
                    text: metric
                },
                series: [{
                    name: metric,
                    data: agentDataHistory[hostname][metric]
                }]
            });
        }
    });
}

// Iniciar la conexión y actualizar cada segundo
connectWebSocket();
setInterval(updateMessages, 1000);

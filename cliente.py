import eel
import asyncio
import json
import websockets
import threading

eel.init('web')

received_messages = []

async def connect_to_server():
    server_url = "ws://10.1.2.7:5000/ws"
    async with websockets.connect(server_url) as websocket:
        print(f"Conectado al servidor {server_url}")
        try:
            while True:
                message = await websocket.recv()
                json_data = json.loads(message)
                print("Datos recibidos:", json_data)
                received_messages.append(json_data)
        except websockets.ConnectionClosed as e:
            print(f"Conexión cerrada: {e}")

def run_asyncio_loop(loop):
    asyncio.set_event_loop(loop)
    loop.run_until_complete(connect_to_server())

@eel.expose
def start_websocket():
    loop = asyncio.new_event_loop()
    thread = threading.Thread(target=run_asyncio_loop, args=(loop,))
    thread.start()

@eel.expose
def get_received_messages():
    return received_messages

if __name__ == '__main__':
    eel.start('index.html', host='localhost', port=8080, size=(700, 600), mode='edge')

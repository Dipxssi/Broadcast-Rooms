import { useEffect, useRef, useState } from "react"

function App() {
  const [messages, setMesages] = useState(["hi there","hello"]);
  const wsRef = useRef();

  useEffect(() =>{
    const ws = new WebSocket("http://localhost:8080");
    ws.onmessage = (event) =>{
      setMesages(m =>[...m,event.data])
    }
    wsRef.current = ws;
    ws.onopen = () =>{
      ws.send(JSON.stringify({
        type : "join",
        payload : {
          roomId : "red"
        }
      }))
    }
  },[]);
  return (
    <div className="bg-black h-screen flex flex-col">
      <div className="flex-1">
      {messages.map((message, index) => (
        <div className="flex m-4">
        <span key={index} className="text-white bg-purple-300 rounded-md p-4 ">
        {message}
        </span>
        </div>
      ))}
      </div>
      <div className="p-4">
      <div className="flex gap-x-5">
        <input 
        id = "message"
        type="text" 
        className="flex-1 bg-white text-black p-2 rounded"
        placeholder="Type your message..."
        />
        <button onClick={() =>{
          const message = document.getElementById("message")?.value;
          wsRef.current.send(JSON.stringify({
            type : "chat",
            payload : {
              message : message
            }
          }))
        }} className="bg-purple-600 text-white rounded-md border-purple-950 border p-2 px-4 hover:bg-purple-700">
        Send message
        </button>
      </div>
      </div>
    </div>
  )
}

export default App

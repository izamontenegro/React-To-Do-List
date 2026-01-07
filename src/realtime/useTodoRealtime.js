import { useEffect, useRef } from "react"; // Adicionado useRef
import { io } from "socket.io-client";

export function useTodoRealtime({ onCreated, onUpdated, onDeleted, onToggled }) {
  const handlers = useRef({ onCreated, onUpdated, onDeleted, onToggled });

  useEffect(() => {
    handlers.current = { onCreated, onUpdated, onDeleted, onToggled };
  }, [onCreated, onUpdated, onDeleted, onToggled]);

  useEffect(() => {
    const socket = io("https://twodo-tasklist.onrender.com", {
      transports: ["websocket"],
      upgrade: false,
    });

    socket.on("connect", () => {
      console.log("Conectado ao Realtime (ID):", socket.id);
    });

    socket.on("message", (data) => {
        const { event, task, task_id } = data;

        switch (event) {
            case "TASK_CREATED":
                onCreated?.(task); 
                break;
            case "TASK_UPDATED":
            case "TASK_TOGGLED":
                onUpdated?.(task);
                break;
            case "TASK_DELETED":
                onDeleted?.(task_id);
            break;
        }
    });

    socket.on("connect_error", (err) => {
      console.error("Erro na conexão Socket.IO:", err.message);
    });

    return () => {
      console.log("Limpando conexão socket...");
      socket.off("message");
      socket.disconnect();
    };
  }, []);
}
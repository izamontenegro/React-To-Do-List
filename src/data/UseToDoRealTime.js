import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export function useToDoRealtime({ baseUrl, onCreated, onUpdated, onDeleted, onToggled }) {
  const handlers = useRef({ onCreated, onUpdated, onDeleted, onToggled });

  useEffect(() => {
    handlers.current = { onCreated, onUpdated, onDeleted, onToggled };
  }, [onCreated, onUpdated, onDeleted, onToggled]);

  useEffect(() => {
    const socket = io(baseUrl, {
      transports: ["websocket"],
      upgrade: false,
    });

    socket.on("connect", () => {
      console.log("Conectado ao Realtime (ID):", socket.id);
    });

    socket.on("message", (data) => {
      const { event, task, task_id } = data;
      const h = handlers.current;

      switch (event) {
        case "TASK_CREATED":
          h.onCreated?.(task);
          break;

        case "TASK_UPDATED":
        case "TASK_TOGGLED":
          h.onUpdated?.(task);
          break;

        case "TASK_DELETED":
          h.onDeleted?.(task_id);
          break;
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Erro na conexão Socket.IO:", err.message);
    });

    return () => {
      socket.off("message");
      socket.disconnect();
    };
  }, [baseUrl]);
}
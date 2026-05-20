"use client";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const BASE_URL = "https://projectm.zuraach.site";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  if (!socketRef.current) {
    socketRef.current = io(BASE_URL, {
      withCredentials: true,
      autoConnect: true,
      reconnectionAttempts: 5,
    });
  }

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return socketRef.current;
}

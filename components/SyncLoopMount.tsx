"use client";

import { useEffect } from "react";

import { startSyncLoop } from "@/lib/sync";

/**
 * SyncLoopMount
 * Mount once near the top of the app. Starts the background sync queue
 * flusher so progress / speed-test / quest / unlock events are pushed
 * to the server when the kid is online. Safe to render on the server
 * (no-ops there).
 */
export function SyncLoopMount() {
  useEffect(() => {
    const stop = startSyncLoop();
    return () => stop();
  }, []);
  return null;
}
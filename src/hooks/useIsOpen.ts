"use client";

import { useMemo } from "react";
import { BusinessSettings } from "@/types";

const dayKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export function useIsOpen(settings: BusinessSettings): { isOpen: boolean; label: string } {
  return useMemo(() => {
    const now = new Date();
    const dayKey = dayKeys[now.getDay()];
    const hours = settings.hours[dayKey as keyof typeof settings.hours];
    if (!hours || hours.closed) return { isOpen: false, label: "Cerrado hoy" };
    const [openH, openM] = hours.open.split(":").map(Number);
    const [closeH, closeM] = hours.close.split(":").map(Number);
    const current = now.getHours() * 60 + now.getMinutes();
    const open = openH * 60 + openM;
    const close = closeH * 60 + closeM;
    const isOpen = current >= open && current < close;
    return { isOpen, label: isOpen ? "Abierto ahora" : "Cerrado ahora" };
  }, [settings]);
}

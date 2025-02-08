import * as Steam from "@/types/steam.types";
import { writable } from "svelte/store";

export const isTyping = writable<boolean>(false);
export const search = writable<string>("");
export const apps = writable<Steam.App[]>();
export const appsByLetter = writable<Record<string, Array<{ name: string; id: string }>>>(
  {}
);

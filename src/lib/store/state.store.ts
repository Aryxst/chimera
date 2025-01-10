import * as Steam from "@/types/steam.types";
import { writable } from "svelte/store";

export const isTyping = writable<boolean>();
export const search = writable<string>();
export const appsList = writable<Steam.App[]>();

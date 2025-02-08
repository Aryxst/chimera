import * as Types from "@/types";

export { CHAR_MAP } from "./char-map";

export enum Downloader {
  Torrent,
  Gofile,
  PixelDrain,
  RealDebrid,
  Unknown,
}

export enum SteamContentDescriptor {
  SomeNudityOrSexualContent = 1,
  FrequenceViolenceOrGore = 2,
  AdultOnlySexualContent = 3,
  FrequentNudityOrSexualContent = 4,
  GeneralMatureContent = 5,
}

export const BYTES_TO_MEGABYTES = 1024 * 1024;

export const SEARCH_DEBOUNCE = 250;

export const ITEMS_PER_PAGE = 20;

export const DEFAULT_APP_SETTINGS: Types.AppSettings = {
  general: {
    downloads_path: "",
    theme: "system",
    locale: "en",
    notifications: {
      when_download_complete: false,
    },
  },
  behavior: {
    launch_minimized: false,
    launch_on_startup: false,
    minimize_to_tray: false,
    disable_nsfw_alert: false,
  },
};

export const DOWNLOADER_NAME: Record<Downloader, string> = {
  [Downloader.Torrent]: "Torrent",
  [Downloader.Gofile]: "Gofile",
  [Downloader.PixelDrain]: "PixelDrain",
  [Downloader.RealDebrid]: "Real-Debrid",
  [Downloader.Unknown]: "Generic HTTP",
};

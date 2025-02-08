import type { AppLocale, Downloader } from "@/constants";
import type { DownloadEvent } from "@/specta-bindings";

export type { LocaleEntry, AppLocale } from "@/constants";

export type AppTheme = "light" | "dark" | "system";

export interface AppSettings {
  general: {
    downloads_path: string;
    theme: AppTheme;
    locale: AppLocale;
    notifications: {
      when_download_complete: boolean;
    };
  };
  behavior: {
    launch_minimized: boolean;
    launch_on_startup: boolean;
    minimize_to_tray: boolean;
    disable_nsfw_alert: boolean;
  };
}

export interface Source {
  name: string;
  url: string;
  downloads: SourceDownload[];
}

export interface SourceDownload {
  title: string;
  fileSize: string;
  uris: string[];
  uploadDate: string;
}

export interface Pack extends SourceDownload {
  packer: string;
  remoteIds: string[];
}

export interface Game {
  title: string;
  remote_id: string;
  executable_path?: string;
  launch_options?: string;
  icon_url?: string;
  playtime_in_seconds: number;
  last_played_at: number;
  created_at: number;
  size?: number;
  running: boolean;
}

type StatusValues = Exclude<
  DownloadEvent extends { type: infer T } ? T : never,
  "started"
>;
type ProgressEvent = Extract<DownloadEvent, { type: "progress" }>;
export interface Download extends Partial<ProgressEvent["data"]> {
  title: string;
  url: string;
  original_url: string;
  remote_id: string;
  downloader: Downloader;
  content_length: number;
  status: StatusValues;
  path?: string;
}

import { CHAR_MAP, Downloader } from "@/constants/";
import { type ClassValue, clsx } from "clsx";
import { addSeconds, differenceInHours, differenceInMinutes } from "date-fns";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const pipe =
  <T>(...fns: ((arg: T) => any)[]) =>
  (arg: T) =>
    fns.reduce((prev, fn) => fn(prev), arg);

export const removeReleaseYearFromTitle = (title: string) =>
  title.replace(/\([0-9]{4}\)/g, "");

export const removeSymbolsFromTitle = (title: string) =>
  title.replace(/[^A-Za-z 0-9]/g, "");

export const removeSpecialEditionFromTitle = (title: string) =>
  title.replace(
    /(The |Digital )?(GOTY|Deluxe|Standard|Ultimate|Definitive|Enhanced|Collector's|Premium|Digital|Limited|Game of the Year|Reloaded|[0-9]{4}) Edition\w /gi,
    ""
  );

export const removeDuplicateSpaces = (title: string) => title.replace(/\s{2,}/g, " ");

export const replaceDotsWithSpace = (title: string) => title.replace(/\./g, " ");

export const replaceNbspWithSpace = (title: string) =>
  title.replace(new RegExp(String.fromCharCode(160), "g"), " ");

export const replaceUnderscoreWithSpace = (title: string) => title.replace(/_/g, " ");

export const formatTitle = pipe<string>(
  str =>
    str.replace(
      new RegExp(Object.keys(CHAR_MAP).join("|"), "g"),
      match => CHAR_MAP[match]
    ),
  str => str.toLowerCase(),
  removeReleaseYearFromTitle,
  removeSpecialEditionFromTitle,
  replaceUnderscoreWithSpace,
  replaceDotsWithSpace,
  replaceNbspWithSpace,
  str => str.replace(/DIRECTOR'S CUT/gi, ""),
  str => str.replace(/Friend's Pass/gi, ""),
  removeSymbolsFromTitle,
  removeDuplicateSpaces,
  str => str.trim()
);

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getDownloaderFromUrl = (url: string): Downloader => {
  if (/https:\/\/.*gofile.io/.test(url)) return Downloader.Gofile;
  if (url.startsWith("magnet:")) return Downloader.Torrent;
  if (url.startsWith("https://1fichier.com")) return Downloader.RealDebrid;
  if (url.startsWith("https://pixeldrain.com")) return Downloader.PixelDrain;
  if (url.startsWith("https://buzzheavier.com")) return Downloader.BuzzHeavier;

  return Downloader.Unknown;
};

export const transformDownloadUrl = (url: string) => {
  switch (getDownloaderFromUrl(url)) {
    case Downloader.BuzzHeavier:
      if (!url.endsWith("/download")) url += "/download";
      return url;
    default:
      return url;
  }
};

export const formatBytes = (size: number) => {
  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB"];
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

export const formatSeconds = (seconds: number) => {
  const now = new Date();
  const futureDate = addSeconds(now, seconds);

  const hours = differenceInHours(futureDate, now);
  const minutes = differenceInMinutes(futureDate, now);

  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }

  return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
};

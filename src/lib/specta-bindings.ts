// @ts-nocheck
// This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

/** user-defined commands **/


export const commands = {
async runExecutable(path: string) : Promise<Result<null, Error>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("run_executable", { path }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async createShortcut(targetPath: string) : Promise<Result<null, Error>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("create_shortcut", { targetPath }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async download(url: string, destPath: string, headers: ([string, string])[] | null) : Promise<Result<null, Error>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("download", { url, destPath, headers }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async abortDownload(url: string) : Promise<Result<null, Error>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("abort_download", { url }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async pauseDownload(url: string) : Promise<Result<null, Error>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("pause_download", { url }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async deleteFile(path: string) : Promise<Result<null, Error>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("delete_file", { path }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async exists(path: string) : Promise<Result<boolean, Error>> {
    try {
    return { status: "ok", data: await TAURI_INVOKE("exists", { path }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
}
}

/** user-defined events **/


export const events = __makeEvents__<{
downloadEvent: DownloadEvent,
executableEvent: ExecutableEvent
}>({
downloadEvent: "download-event",
executableEvent: "executable-event"
})

/** user-defined constants **/



/** user-defined types **/

export type DownloadEvent = { type: "started"; data: { url: string; path: string; content_length: number } } | { type: "progress"; data: { url: string; progress_percentage: number; downloaded_bytes: number; download_speed: number; eta: number } } | { type: "paused"; data: { url: string } } | { type: "completed"; data: { url: string } } | { type: "aborted"; data: { url: string } }
export type Error = 
/**
 * IO errors
 */
"IoError" | 
/**
 * HTTP errors
 */
{ Timeout: string } | { StatusCode: string } | { RequestFailed: string } | { ParsingFailed: string } | 
/**
 * Catch-all reqwest errors
 */
{ HttpClient: string } | 
/**
 * Tauri errors
 */
{ TauriError: string } | 
/**
 * Other errors
 */
{ Other: string }
export type ExecutableEvent = { type: "started"; data: { path: string } } | { type: "finished"; data: { path: string; execution_time: number } }

/** tauri-specta globals **/

import {
	invoke as TAURI_INVOKE,
	Channel as TAURI_CHANNEL,
} from "@tauri-apps/api/core";
import * as TAURI_API_EVENT from "@tauri-apps/api/event";
import { type WebviewWindow as __WebviewWindow__ } from "@tauri-apps/api/webviewWindow";

type __EventObj__<T> = {
	listen: (
		cb: TAURI_API_EVENT.EventCallback<T>,
	) => ReturnType<typeof TAURI_API_EVENT.listen<T>>;
	once: (
		cb: TAURI_API_EVENT.EventCallback<T>,
	) => ReturnType<typeof TAURI_API_EVENT.once<T>>;
	emit: null extends T
		? (payload?: T) => ReturnType<typeof TAURI_API_EVENT.emit>
		: (payload: T) => ReturnType<typeof TAURI_API_EVENT.emit>;
};

export type Result<T, E> =
	| { status: "ok"; data: T }
	| { status: "error"; error: E };

function __makeEvents__<T extends Record<string, any>>(
	mappings: Record<keyof T, string>,
) {
	return new Proxy(
		{} as unknown as {
			[K in keyof T]: __EventObj__<T[K]> & {
				(handle: __WebviewWindow__): __EventObj__<T[K]>;
			};
		},
		{
			get: (_, event) => {
				const name = mappings[event as keyof T];

				return new Proxy((() => {}) as any, {
					apply: (_, __, [window]: [__WebviewWindow__]) => ({
						listen: (arg: any) => window.listen(name, arg),
						once: (arg: any) => window.once(name, arg),
						emit: (arg: any) => window.emit(name, arg),
					}),
					get: (_, command: keyof __EventObj__<any>) => {
						switch (command) {
							case "listen":
								return (arg: any) => TAURI_API_EVENT.listen(name, arg);
							case "once":
								return (arg: any) => TAURI_API_EVENT.once(name, arg);
							case "emit":
								return (arg: any) => TAURI_API_EVENT.emit(name, arg);
						}
					},
				});
			},
		},
	);
}

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
//! Chimera - A game launcher built with Tauri
//!
//! This is the main entry point for the Tauri application.
mod commands;
mod exec_handler;
mod http_downloader;
use tauri::Manager;
use tokio::sync::Mutex;

#[derive(Default)]
pub struct AppState {
    abort_download: Option<String>,
    pause_download: Option<String>,
}

#[derive(Debug, specta::Type, thiserror::Error)]
pub enum Error {
    /// IO errors
    #[error(transparent)]
    IoError(
        #[from]
        #[serde(skip)] // io::Error is not `Serialize` or `specta::Type`
        std::io::Error,
    ),
    /// HTTP errors
    #[error("Request timed out: \"{0}\"")]
    Timeout(String),
    #[error("Request returned non-200 status: \"{0}\"")]
    StatusCode(String),
    #[error("Error executing request: \"{0}\"")]
    RequestFailed(String),
    #[error("Error parsing body as json: \"{0}\"")]
    ParsingFailed(String),
    /// Catch-all reqwest errors
    #[error("HTTP Client Error: \"{0}\"")]
    HttpClient(String),
    /// Tauri errors
    #[error("Tauri error: {0}")]
    TauriError(String),
    /// Other errors
    #[error("{0}")]
    Other(String),
}

impl Error {
    #[must_use]
    pub const fn code(&self) -> &'static str {
        match self {
            Error::IoError(_) => "IoError",
            Error::Timeout(_) => "Timeout",
            Error::StatusCode(_) => "StatusCode",
            Error::RequestFailed(_) => "RequestFailed",
            Error::ParsingFailed(_) => "ParsingFailed",
            Error::HttpClient(_) => "HttpClient",
            Error::TauriError(_) => "TauriError",
            Error::Other(_) => "Other",
        }
    }
}

impl From<tauri_plugin_http::reqwest::Error> for Error {
    fn from(source: tauri_plugin_http::reqwest::Error) -> Self {
        if source.is_timeout() {
            Self::Timeout(source.to_string())
        } else if source.is_status() {
            Self::StatusCode(source.to_string())
        } else if source.is_decode() {
            Self::ParsingFailed(source.to_string())
        } else if source.is_request() {
            Self::RequestFailed(source.to_string())
        } else {
            Self::HttpClient(source.to_string())
        }
    }
}

// we must manually implement serde::Serialize
impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

/// Main entry point for the Tauri application.
///
///
/// # Panics:
///
/// Will panic if:
///
/// - Failed to build the main window
/// - Failed to focus the main window
/// - Failed to manage the app state
fn main() {
    let builder = tauri_specta::Builder::<tauri::Wry>::new()
        .commands(tauri_specta::collect_commands![
            exec_handler::run_executable,
            exec_handler::create_shortcut,
            http_downloader::download,
            http_downloader::abort_download,
            http_downloader::pause_download,
            commands::fs::delete_file,
            commands::fs::exists,
        ])
        .events(tauri_specta::collect_events![
            http_downloader::DownloadEvent,
            exec_handler::ExecutableEvent
        ]);

    #[cfg(debug_assertions)]
    builder
        .export(
            specta_typescript::Typescript::default()
                .bigint(specta_typescript::BigIntExportBehavior::Number)
                .header("// @ts-nocheck"),
            "../src/lib/specta-bindings.ts",
        )
        .expect("Failed to export typescript bindings");
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            app.get_webview_window("main")
                .expect("no main window")
                .set_focus()
                .expect("failed to focus main window");
        }))
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            builder.mount_events(app);
            Ok(())
        })
        .manage(Mutex::new(AppState::default()))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/**
 * Utility to upload files directly to Google Drive via Apps Script Web App
 */

export interface AppsScriptResponse {
  status?: string;
  url?: string;
  webViewLink?: string;
  downloadUrl?: string;
  id?: string;
  fileUrl?: string; // some scripts return fileUrl instead of url
}

export async function uploadToAppsScript(
  fileName: string,
  dataUrl: string,
  mimeType: string
): Promise<string> {
  const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbxRBhj_faFdPboG3AhdFR-hMCLlA021yCwvX6UkuA0OejHgNVLFyazXZuz1lePCbvQ4iA/exec';

  // Extract raw base64 content
  const parts = dataUrl.split(',');
  const rawBase64 = parts[1] || dataUrl;

  // Build a multi-compatible payload containing all typical parameter structures
  const payload = {
    file: rawBase64,
    base64: rawBase64,
    content: rawBase64,
    filename: fileName,
    name: fileName,
    mimeType: mimeType,
    type: mimeType,
    folderId: '1BwxVsYU_Hz6P9kGNZAGtYSMObQf_ta3T', // standard folder ID requested
  };

  try {
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      mode: 'cors', // Google Apps Script Web Apps support CORS when returning TextOutput
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Apps Script handles text/plain best avoiding preflight issues
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as AppsScriptResponse;
    console.log('Apps Script Upload Response:', data);

    // Try finding the URL from typical response keys returned by Apps Script
    const finalUrl = data.url || data.webViewLink || data.fileUrl || data.downloadUrl;
    if (finalUrl) {
      return finalUrl;
    }

    if (data.id) {
      return `https://drive.google.com/file/d/${data.id}/view?usp=drivesdk`;
    }

    throw new Error('Upload succeeded but no preview URL was returned in the Apps Script response.');
  } catch (error) {
    console.error('Failed uploading file to Apps Script Web App:', error);
    throw error;
  }
}

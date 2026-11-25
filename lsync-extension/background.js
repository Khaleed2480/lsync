const API_ENDPOINT = 'https://lsync-1-0-0-1.onrender.com/api/watch-events';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'RECORD_WATCH_EVENT') {
    handleRecordWatchEvent(message.payload)
      .then((result) => sendResponse({ success: true, data: result }))
      .catch((err) => sendResponse({ success: false, error: err.message }));

    return true;
  }
});

async function handleRecordWatchEvent(payload) {
  const storage = await chrome.storage.local.get(['extensionToken', 'loginToken']);
  const token = storage.extensionToken || storage.loginToken;

  if (!token) {
    throw new Error('Not signed in. Open the LSync extension icon and sign in first.');
  }

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: payload.title,
      url: payload.url,
      videoUrl: payload.url,
      videoId: payload.videoId,
      platform: 'YouTube',
      durationSeconds: payload.durationSeconds,
      durationMinutes: Math.max(1, Math.round(payload.durationSeconds / 60)),
      watchedAt: new Date().toISOString(),
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || data.error || `Server error (${response.status})`);
  }

  await chrome.storage.local.set({
    lastSyncedTitle: payload.title,
    lastSyncedAt: new Date().toLocaleTimeString(),
  });

  return data;
}
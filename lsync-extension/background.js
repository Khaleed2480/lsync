const API_ENDPOINT = 'https://lsync-1-0-0-1.onrender.com/api/watch-events';

// Safe UUID Generator for Chrome/Edge extensions
function getUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

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

  const seconds = Math.max(1, Math.round(payload.durationSeconds || 60));
  const uniqueEventId = getUUID();

  // Send exact fields required by James's backend validator
  const requestBody = {
    clientEventId: uniqueEventId,
    secondsWatched: seconds,
    durationSeconds: seconds,
    durationMinutes: Math.max(1, Math.round(seconds / 60)),
    videoId: payload.videoId || 'unknown',
    videoTitle: payload.title || 'YouTube Study Session',
    title: payload.title || 'YouTube Study Session',
    videoUrl: payload.url || window.location?.href || '',
    url: payload.url || '',
    platform: 'YouTube',
    watchedAt: new Date().toISOString(),
  };

  console.log('[LSync] Sending watch event payload:', requestBody);

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-extension-token': token,
    },
    body: JSON.stringify(requestBody),
  });

  const rawText = await response.text();
  let data = {};
  try {
    data = JSON.parse(rawText);
  } catch (e) {}

  if (!response.ok || data.success === false) {
    const serverMsg =
      (Array.isArray(data.errors) && data.errors.join(', ')) ||
      data.message ||
      data.error ||
      rawText.slice(0, 100);

    throw new Error(`Error ${response.status}: ${serverMsg}`);
  }

  await chrome.storage.local.set({
    lastSyncedTitle: payload.title,
    lastSyncedAt: new Date().toLocaleTimeString(),
  });

  return data;
}
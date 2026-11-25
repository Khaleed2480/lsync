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
  const storage = await chrome.storage.local.get(['extensionToken']);
  const token = storage.extensionToken;

  if (!token) {
    throw new Error('No extension token found. Click "Disconnect & Sign Out" and sign in fresh.');
  }

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-extension-token': token,
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

  const rawText = await response.text();
  let data = {};
  try {
    data = JSON.parse(rawText);
  } catch (e) {}

  if (!response.ok || data.success === false) {
    const serverMsg =
      data.message ||
      data.error ||
      (Array.isArray(data.errors) && data.errors[0]?.msg) ||
      rawText.slice(0, 80);

    throw new Error(`Error ${response.status}: ${serverMsg}`);
  }

  await chrome.storage.local.set({
    lastSyncedTitle: payload.title,
    lastSyncedAt: new Date().toLocaleTimeString(),
  });

  return data;
}
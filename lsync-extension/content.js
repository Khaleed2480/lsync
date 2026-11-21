let watchedSeconds = 0;
let currentUrl = window.location.href;

// Extract YouTube video ID from URL
function getVideoId(url) {
  try {
    const u = new URL(url);
    return u.searchParams.get('v') || '';
  } catch (e) {
    return '';
  }
}

// Get clean video title
function getVideoTitle() {
  const h1 = document.querySelector('h1.ytd-watch-metadata yt-formatted-string');
  if (h1 && h1.textContent.trim()) {
    return h1.textContent.trim();
  }
  return document.title.replace(' - YouTube', '').trim();
}

// Send watch time to background.js
function sendWatchEvent(secondsToSend) {
  if (!window.location.href.includes('/watch')) return;
  if (secondsToSend < 5) return;

  const payload = {
    title: getVideoTitle(),
    url: window.location.href,
    videoId: getVideoId(window.location.href),
    durationSeconds: secondsToSend,
  };

  chrome.runtime.sendMessage(
    { type: 'RECORD_WATCH_EVENT', payload },
    (response) => {
      if (chrome.runtime.lastError) return;
      if (response && response.success) {
        console.log('[LSync] Synced YouTube watch event:', payload.title);
      }
    }
  );
}

// Track active playback every 1 second
setInterval(() => {
  // Reset counter if user switched to another YouTube video
  if (window.location.href !== currentUrl) {
    if (watchedSeconds >= 10) {
      sendWatchEvent(watchedSeconds);
    }
    watchedSeconds = 0;
    currentUrl = window.location.href;
  }

  if (!window.location.href.includes('/watch')) return;

  const video = document.querySelector('video');
  // Only count time when video is actually playing
  if (video && !video.paused && !video.ended) {
    watchedSeconds += 1;

    // Auto-sync to LSync every 60 seconds
    if (watchedSeconds >= 60) {
      sendWatchEvent(watchedSeconds);
      watchedSeconds = 0;
    }
  }
}, 1000);

// Listen for manual "Sync Now" click from the popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'MANUAL_SYNC_CURRENT_VIDEO') {
    if (!window.location.href.includes('/watch')) {
      sendResponse({ success: false, error: 'Open a YouTube video first!' });
      return;
    }

    const seconds = watchedSeconds > 5 ? watchedSeconds : 60;
    const payload = {
      title: getVideoTitle(),
      url: window.location.href,
      videoId: getVideoId(window.location.href),
      durationSeconds: seconds,
    };

    chrome.runtime.sendMessage({ type: 'RECORD_WATCH_EVENT', payload }, (res) => {
      watchedSeconds = 0;
      sendResponse(res || { success: false, error: 'No response from background' });
    });

    return true;
  }
});
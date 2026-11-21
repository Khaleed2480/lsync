document.addEventListener('DOMContentLoaded', async () => {
  const tokenInput = document.getElementById('tokenInput');
  const saveBtn = document.getElementById('saveBtn');
  const syncNowBtn = document.getElementById('syncNowBtn');
  const statusBadge = document.getElementById('statusBadge');
  const msg = document.getElementById('msg');
  const lastTitle = document.getElementById('lastTitle');

  // Load saved token & last synced video
  const data = await chrome.storage.local.get([
    'extensionToken',
    'lastSyncedTitle',
    'lastSyncedAt',
  ]);

  if (data.extensionToken) {
    tokenInput.value = data.extensionToken;
    statusBadge.textContent = '● Active';
    statusBadge.classList.add('active');
  }

  if (data.lastSyncedTitle) {
    lastTitle.textContent = `${data.lastSyncedTitle} (${data.lastSyncedAt})`;
  }

  // Save token
  saveBtn.addEventListener('click', async () => {
    const val = tokenInput.value.trim();
    if (!val) {
      msg.style.color = '#F87171';
      msg.textContent = 'Please paste a valid token.';
      return;
    }

    await chrome.storage.local.set({ extensionToken: val });
    statusBadge.textContent = '● Active';
    statusBadge.classList.add('active');
    msg.style.color = '#34D399';
    msg.textContent = 'Extension linked to your LSync account!';
  });

  // Manual sync button (Awesome for live demos!)
  syncNowBtn.addEventListener('click', async () => {
    msg.style.color = '#F4A836';
    msg.textContent = 'Syncing video...';

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url || !tab.url.includes('youtube.com/watch')) {
      msg.style.color = '#F87171';
      msg.textContent = 'Please open a YouTube video first.';
      return;
    }

    chrome.tabs.sendMessage(
      tab.id,
      { type: 'MANUAL_SYNC_CURRENT_VIDEO' },
      (response) => {
        if (chrome.runtime.lastError || !response) {
          msg.style.color = '#F87171';
          msg.textContent = 'Refresh the YouTube tab and try again.';
          return;
        }
        if (response.success) {
          msg.style.color = '#34D399';
          msg.textContent = 'Synced to LSync successfully!';
          chrome.storage.local.get(['lastSyncedTitle', 'lastSyncedAt']).then((updated) => {
            if (updated.lastSyncedTitle) {
              lastTitle.textContent = `${updated.lastSyncedTitle} (${updated.lastSyncedAt})`;
            }
          });
        } else {
          msg.style.color = '#F87171';
          msg.textContent = response.error || 'Sync failed.';
        }
      }
    );
  });
});
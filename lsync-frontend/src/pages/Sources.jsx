import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw,
  Plus,
  Check,
  X,
  KeyRound,
  Copy,
  GitBranch,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Link2,
} from 'lucide-react';
import { apiRequest, BASE_URL } from '../utils/api';

export default function Sources() {
  const navigate = useNavigate();

  // Platform Catalog & Linked Accounts
  const [platforms, setPlatforms] = useState([]);
  const [linkedAccounts, setLinkedAccounts] = useState([]);

  // GitHub Repositories State
  const [githubRepos, setGithubRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [syncingRepo, setSyncingRepo] = useState(null);

  // Chrome Extension Token State
  const [extensionToken, setExtensionToken] = useState(
    localStorage.getItem('extension_token') || ''
  );
  const [generatingExtToken, setGeneratingExtToken] = useState(false);
  const [copiedExtToken, setCopiedExtToken] = useState(false);

  // Link Account Modal (For Coursera, Udemy, edX, etc.)
  const [linkModalPlatform, setLinkModalPlatform] = useState(null);
  const [platformUsername, setPlatformUsername] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [isLinking, setIsLinking] = useState(false);

  // Add Custom Platform Modal
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customType, setCustomType] = useState('Website');

  // Blogs & Docs URL Quick-Log
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [addingWebsite, setAddingWebsite] = useState(false);

  // Global Feedback
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // ================= 1. FETCH PLATFORMS & LINKED ACCOUNTS ON LOAD =================
  useEffect(() => {
    const loadSourcesData = async () => {
      try {
        // Fetch available platforms
        const platRes = await apiRequest('/platforms/platform', { method: 'GET' });
        const platList = Array.isArray(platRes)
          ? platRes
          : platRes.platforms || platRes.data || [];
        setPlatforms(platList);
      } catch (err) {
        console.log('Platforms fetch note:', err.message);
      }

      // Fetch user's current linked accounts via /users/me
      if (localStorage.getItem('token')) {
        try {
          const meRes = await apiRequest('/users/me', { method: 'GET' });
          const userObj = meRes.user || meRes.data || meRes;
          const accounts = userObj.accounts || userObj.linkedAccounts || [];
          setLinkedAccounts(accounts);

          // Sync connected platform names to localStorage for Dashboard/Analytics/Skills
          const names = accounts.map(
            (acc) => acc.platform?.name || acc.platformName || acc.platformUsername || 'Connected Source'
          );
          if (names.length > 0) {
            localStorage.setItem('connected_platforms', JSON.stringify(names));
          }
        } catch (err) {
          console.log('Could not load /users/me accounts:', err.message);
        }
      }
    };

    loadSourcesData();
  }, []);

  // Helper to update localStorage connected_platforms list
  const syncConnectedStorage = (newAccountsList, extraName) => {
    const names = newAccountsList.map(
      (a) => a.platform?.name || a.platformName || a.name || 'Platform'
    );
    if (extraName && !names.includes(extraName)) names.push(extraName);
    localStorage.setItem('connected_platforms', JSON.stringify(names));
  };

  // ================= 2. GITHUB OAUTH & REPOSITORY SYNC =================
  const handleConnectGitHub = async () => {
    setErrorMsg('');
    setStatusMsg('Connecting to GitHub...');

    try {
      // 1. Sends the JWT token in headers!
      const data = await apiRequest('/integrations/github/connect', { method: 'GET' });

      // 2. Extracts GitHub's official authorization URL from backend
      const targetUrl = data.url || data.authUrl || data.redirectUrl || data.data?.url;

      if (targetUrl) {
        // Jumps straight to GitHub's authorization page!
        window.location.href = targetUrl;
      } else {
        console.log('GitHub connect response:', data);
        setStatusMsg('Connected! Checking repositories...');
        handleLoadGitHubRepos();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Could not connect to GitHub.');
    }
  };


  const handleLoadGitHubRepos = async () => {
    setLoadingRepos(true);
    setErrorMsg('');
    try {
      const data = await apiRequest('/integrations/github/repositories', { method: 'GET' });
      const repos = Array.isArray(data)
        ? data
        : data.repositories || data.repos || data.data || [];
      setGithubRepos(repos);
      if (repos.length === 0) {
        setStatusMsg('No GitHub repositories found. Make sure GitHub is authorized first.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Please authorize GitHub first before loading repositories.');
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleSyncRepoCommits = async (repo) => {
    const owner = repo.owner?.login || repo.owner || 'user';
    const repoName = repo.name;
    setSyncingRepo(repoName);
    setErrorMsg('');
    setStatusMsg('');

    try {
      await apiRequest(`/integrations/github/repositories/${owner}/${repoName}/sync`, {
        method: 'POST',
      });
      setStatusMsg(`Synced commits from ${owner}/${repoName} as learning evidence!`);

      // Mark GitHub as connected in localStorage
      const current = JSON.parse(localStorage.getItem('connected_platforms') || '[]');
      if (!current.includes('GitHub')) {
        localStorage.setItem('connected_platforms', JSON.stringify([...current, 'GitHub']));
      }
    } catch (err) {
      setErrorMsg(err.message || `Failed to sync ${repoName}.`);
    } finally {
      setSyncingRepo(null);
    }
  };

  // ================= 3. YOUTUBE OAUTH CONNECT =================
  const handleConnectYouTube = async () => {
    setErrorMsg('');
    try {
      const data = await apiRequest('/integrations/youtube/connect', { method: 'GET' });
      const redirectUrl = data.url || data.authUrl || data.redirectUrl;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        window.open(`${BASE_URL}/api/integrations/youtube/connect`, '_blank');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Use the Chrome Extension Token below to track YouTube watch hours!');
    }
  };

  // ================= 4. CHROME EXTENSION TOKEN (GENERATE / REVOKE) =================
  const handleGenerateExtensionToken = async () => {
    setGeneratingExtToken(true);
    setErrorMsg('');
    setStatusMsg('');
    try {
      const data = await apiRequest('/extension/link', { method: 'POST' });
      const tokenVal = data.token || data.extensionToken || data.data?.token || '';
      if (tokenVal) {
        setExtensionToken(tokenVal);
        localStorage.setItem('extension_token', tokenVal);
        setStatusMsg('Chrome Extension token generated! Copy and paste it into your extension.');
      } else {
        setStatusMsg('Extension link generated! Check backend response.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Could not generate extension token.');
    } finally {
      setGeneratingExtToken(false);
    }
  };

  const handleRevokeExtensionToken = async () => {
    setGeneratingExtToken(true);
    setErrorMsg('');
    setStatusMsg('');
    try {
      await apiRequest('/extension/link', { method: 'DELETE' });
      setExtensionToken('');
      localStorage.removeItem('extension_token');
      setStatusMsg('Chrome Extension token revoked.');
    } catch (err) {
      setErrorMsg(err.message || 'Could not revoke extension token.');
    } finally {
      setGeneratingExtToken(false);
    }
  };

  const copyExtensionToken = () => {
    navigator.clipboard.writeText(extensionToken);
    setCopiedExtToken(true);
    setTimeout(() => setCopiedExtToken(false), 2000);
  };

  // ================= 5. LINK PLATFORM ACCOUNT (POST /users/accounts) =================
  const handleLinkPlatformSubmit = async (e) => {
    e.preventDefault();
    if (!linkModalPlatform) return;
    setIsLinking(true);
    setErrorMsg('');
    setStatusMsg('');

    try {
      // Find matching platformId from backend catalog if available
      const matched = platforms.find(
        (p) => p.name?.toLowerCase() === linkModalPlatform.toLowerCase()
      );

      const payload = {
        platformId: matched?._id || matched?.id || linkModalPlatform.toLowerCase(),
        platformUsername: platformUsername.trim(),
        profileUrl: profileUrl.trim(),
      };

      const data = await apiRequest('/users/accounts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const createdAccount = data.account || data.data || {
        _id: Date.now().toString(),
        platformName: linkModalPlatform,
        platformUsername,
        profileUrl,
      };

      const updated = [...linkedAccounts, createdAccount];
      setLinkedAccounts(updated);
      syncConnectedStorage(updated, linkModalPlatform);

      setStatusMsg(`${linkModalPlatform} linked successfully!`);
      setLinkModalPlatform(null);
      setPlatformUsername('');
      setProfileUrl('');
    } catch (err) {
      setErrorMsg(err.message || `Could not link ${linkModalPlatform}.`);
    } finally {
      setIsLinking(false);
    }
  };

  const handleRemoveLinkedAccount = async (accountId, name) => {
    setErrorMsg('');
    try {
      await apiRequest(`/users/accounts/${accountId}`, { method: 'DELETE' });
      const updated = linkedAccounts.filter((a) => (a._id || a.id) !== accountId);
      setLinkedAccounts(updated);
      syncConnectedStorage(updated);
      setStatusMsg(`${name} disconnected.`);
    } catch (err) {
      setErrorMsg(err.message || 'Could not disconnect account.');
    }
  };

  // ================= 6. CREATE CUSTOM PLATFORM (POST /platforms/platform) =================
  const handleCreateCustomPlatform = async (e) => {
    e.preventDefault();
    if (!customName.trim()) return;
    setErrorMsg('');
    try {
      const data = await apiRequest('/platforms/platform', {
        method: 'POST',
        body: JSON.stringify({
          name: customName.trim(),
          type: customType,
        }),
      });
      const newPlat = data.platform || data.data || { name: customName.trim(), type: customType };
      setPlatforms([...platforms, newPlat]);
      setStatusMsg(`Platform "${customName}" created! You can now link your account to it.`);
      setCustomName('');
      setShowCustomModal(false);
    } catch (err) {
      setErrorMsg(err.message || 'Could not create custom platform.');
    }
  };

  // ================= 7. BLOGS / DOCS LINK INGESTION (POST /logs/log) =================
  const handleAddWebsiteLog = async (e) => {
    e.preventDefault();
    if (!websiteUrl.trim()) return;
    setAddingWebsite(true);
    setErrorMsg('');
    setStatusMsg('');

    try {
      await apiRequest('/logs/log', {
        method: 'POST',
        body: JSON.stringify({
          title: `Documentation Study: ${websiteUrl.replace(/^https?:\/\//, '').split('/')[0]}`,
          description: `Logged external reading session from ${websiteUrl}`,
          durationMinutes: 30,
          durationSeconds: 1800,
          type: 'Reading',
          proofUrl: websiteUrl.trim(),
          date: new Date().toISOString(),
        }),
      });

      setStatusMsg('Learning link saved to your Activity logs!');
      setWebsiteUrl('');
    } catch (err) {
      setErrorMsg(err.message || 'Could not log website activity.');
    } finally {
      setAddingWebsite(false);
    }
  };

  const isPlatformLinked = (name) =>
    linkedAccounts.some(
      (a) =>
        (a.platform?.name || a.platformName || '').toLowerCase() === name.toLowerCase()
    );

  const getLinkedAccount = (name) =>
    linkedAccounts.find(
      (a) =>
        (a.platform?.name || a.platformName || '').toLowerCase() === name.toLowerCase()
    );

  const totalConnected = linkedAccounts.length + (extensionToken ? 1 : 0);

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-6xl mx-auto w-full font-sans">
      
      {/* Header Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div className="max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A102F] tracking-tight">
            Link your learning sources
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1.5 leading-relaxed">
            Connect GitHub, YouTube, Coursera, or link our Chrome Extension to track your learning across the web.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs w-full md:w-64 shrink-0">
          <div className="flex items-center justify-between text-xs font-bold text-[#1A102F] mb-2">
            <span>{totalConnected} active integrations</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4D34D4] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, totalConnected * 20)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Global Alerts */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 mb-6 rounded-2xl bg-red-100 border border-red-200 text-red-700 text-xs font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {statusMsg && (
        <div className="flex items-center gap-2 p-3.5 mb-6 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Top Action: Add Custom Platform */}
      <div className="flex justify-end mb-6">
        <button
          type="button"
          onClick={() => setShowCustomModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-[#633BB3] shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Platform</span>
        </button>
      </div>

      {/* ================= INTEGRATION CARDS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        
        {/* 1. GITHUB INTEGRATION CARD (OAuth + Repo Sync) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs flex flex-col justify-between md:col-span-2">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#1A102F] text-white font-black text-lg flex items-center justify-center shadow-xs">
                  G
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A102F]">GitHub Integration</h3>
                  <span className="text-xs text-gray-400 font-medium">
                    Authorize GitHub & sync repository commits as verified coding proof
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleConnectGitHub}
                  className="px-4 py-2 rounded-xl bg-[#1A102F] hover:bg-black text-white text-xs font-bold transition cursor-pointer"
                >
                  Authorize GitHub
                </button>
                <button
                  type="button"
                  onClick={handleLoadGitHubRepos}
                  disabled={loadingRepos}
                  className="px-4 py-2 rounded-xl border border-[#633BB3] text-[#633BB3] hover:bg-purple-50 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>{loadingRepos ? 'Loading Repos...' : 'Load Repositories'}</span>
                </button>
              </div>
            </div>

            {/* Loaded GitHub Repositories List */}
            {githubRepos.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 max-h-60 overflow-y-auto">
                <span className="text-xs font-bold text-[#1A102F] block mb-2">
                  Select a repository to sync commits:
                </span>
                {githubRepos.map((repo) => (
                  <div
                    key={repo.id || repo.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FC] border border-gray-200/70"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#1A102F]">{repo.name}</h4>
                      <span className="text-[10px] text-gray-400">
                        {repo.language || 'Code'} • {repo.private ? 'Private' : 'Public'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSyncRepoCommits(repo)}
                      disabled={syncingRepo === repo.name}
                      className="px-3 py-1.5 rounded-lg bg-[#633BB3] hover:bg-[#522F9E] text-white text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3 h-3 ${syncingRepo === repo.name ? 'animate-spin' : ''}`} />
                      <span>{syncingRepo === repo.name ? 'Syncing...' : 'Sync Commits'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. CHROME EXTENSION & YOUTUBE TRACKING CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#633BB3]/25 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shadow-xs">
                  <svg className="w-5 h-5 fill-red-600" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A102F]">YouTube & Chrome Extension</h3>
                  <span className="text-xs text-gray-400 font-medium">Automatic video watch tracking</span>
                </div>
              </div>

              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  extensionToken ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {extensionToken ? 'Token Active' : 'Not linked'}
              </span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Generate an Extension Token to link your Chrome Extension and automatically record YouTube tutorial watch hours.
            </p>

            {extensionToken && (
              <div className="mb-4 p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <KeyRound className="w-4 h-4 text-[#633BB3] shrink-0" />
                  <code className="text-[11px] font-bold text-[#1A102F] truncate">
                    {extensionToken}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={copyExtensionToken}
                  className="text-[11px] font-bold text-[#633BB3] hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedExtToken ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleGenerateExtensionToken}
              disabled={generatingExtToken}
              className="flex-1 py-2.5 rounded-xl bg-[#9667E0] hover:bg-[#8553D6] text-white text-xs font-bold transition cursor-pointer"
            >
              {extensionToken ? 'Regenerate Token' : 'Generate Extension Token'}
            </button>

            {extensionToken ? (
              <button
                type="button"
                onClick={handleRevokeExtensionToken}
                className="px-3.5 py-2.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
              >
                Revoke
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConnectYouTube}
                className="px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold transition cursor-pointer"
              >
                OAuth
              </button>
            )}
          </div>
        </div>

        {/* 3. BLOGS & DOCUMENTATION CARD (POST /logs/log) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 font-bold text-lg flex items-center justify-center">
                <Link2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1A102F]">Blogs and documentation</h3>
                <span className="text-xs text-gray-400 font-medium">Log articles & technical docs</span>
              </div>
            </div>

            <p className="text-xs font-bold text-[#1A102F] mb-2">
              Paste a link from a site you studied
            </p>

            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://developer.mozilla.org/..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-[#1A102F] placeholder-gray-300 focus:outline-none focus:border-[#F4A836] transition mb-4"
            />
          </div>

          <button
            type="button"
            onClick={handleAddWebsiteLog}
            disabled={addingWebsite}
            className="w-full py-2.5 rounded-xl text-xs font-bold transition border border-[#F4A836] text-[#1A102F] bg-white hover:bg-orange-50/20 cursor-pointer"
          >
            {addingWebsite ? 'Saving Activity...' : 'Add website to Learning Logs'}
          </button>
        </div>

        {/* 4. COURSERA, UDEMY, EDX & CUSTOM PLATFORMS */}
        {[
          { name: 'Coursera', type: 'Online courses', badge: 'C', bg: 'bg-blue-50 text-[#0056D2]' },
          { name: 'Udemy', type: 'Online courses', badge: 'U', bg: 'bg-[#5B21B6] text-white' },
          { name: 'edX', type: 'Online courses', badge: 'edX', bg: 'bg-[#02262B] text-[#D1FAE5]' },
          ...platforms
            .filter((p) => !['coursera', 'udemy', 'edx', 'github', 'youtube'].includes(p.name?.toLowerCase()))
            .map((p) => ({
              name: p.name,
              type: p.type || 'Custom Platform',
              badge: p.name?.slice(0, 1).toUpperCase(),
              bg: 'bg-[#633BB3] text-white',
            })),
        ].map((plat) => {
          const linked = isPlatformLinked(plat.name);
          const accountObj = getLinkedAccount(plat.name);
          return (
            <div
              key={plat.name}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${plat.bg} font-black text-sm flex items-center justify-center shadow-xs`}>
                      {plat.badge}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#1A102F]">{plat.name}</h3>
                      <span className="text-xs text-gray-400 font-medium">{plat.type}</span>
                    </div>
                  </div>

                  {linked ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Connected
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                      Not connected
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  {linked
                    ? `Linked as ${accountObj?.platformUsername || 'Active Learner'}`
                    : `Link your ${plat.name} profile to organize courses and certificates in one portfolio.`}
                </p>
              </div>

              {linked ? (
                <button
                  type="button"
                  onClick={() => handleRemoveLinkedAccount(accountObj?._id || accountObj?.id, plat.name)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold transition border border-[#F4A836] text-[#1A102F] bg-white hover:bg-orange-50/20 cursor-pointer"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setLinkModalPlatform(plat.name)}
                  className="w-full py-2.5 rounded-xl bg-[#9667E0] hover:bg-[#8553D6] text-white text-xs font-bold transition shadow-md shadow-[#9667E0]/20 cursor-pointer"
                >
                  Connect {plat.name}
                </button>
              )}
            </div>
          );
        })}

      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-end gap-6 pt-4 border-t border-gray-200/80">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#9667E0] hover:bg-[#8553D6] text-white text-xs font-bold shadow-md shadow-[#9667E0]/25 transition cursor-pointer active:scale-95"
        >
          <span>Continue to dashboard</span>
          <span>&rarr;</span>
        </button>
      </div>

      {/* ================= MODAL: LINK PLATFORM ACCOUNT (POST /users/accounts) ================= */}
      {linkModalPlatform && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-[#1A102F]">
                Connect {linkModalPlatform}
              </h3>
              <button
                onClick={() => setLinkModalPlatform(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLinkPlatformSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A102F] mb-1">
                  Your {linkModalPlatform} Username
                </label>
                <input
                  type="text"
                  value={platformUsername}
                  onChange={(e) => setPlatformUsername(e.target.value)}
                  placeholder="e.g. daniel_okunlola"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-[#1A102F] focus:outline-none focus:border-[#633BB3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A102F] mb-1">
                  Profile or Course URL
                </label>
                <input
                  type="url"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  placeholder={`https://${linkModalPlatform.toLowerCase()}.org/user/...`}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-[#1A102F] focus:outline-none focus:border-[#633BB3]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setLinkModalPlatform(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLinking}
                  className="px-5 py-2 rounded-xl bg-[#633BB3] hover:bg-[#522F9E] text-white text-xs font-bold cursor-pointer shadow-md"
                >
                  {isLinking ? 'Connecting...' : 'Save Connection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE CUSTOM PLATFORM (POST /platforms/platform) ================= */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-[#1A102F]">
                Create Custom Learning Platform
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomPlatform} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A102F] mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Scrimba, LeetCode, freeCodeCamp"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-[#1A102F] focus:outline-none focus:border-[#633BB3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A102F] mb-1">
                  Platform Type
                </label>
                <select
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1A102F] focus:outline-none focus:border-[#633BB3]"
                >
                  <option value="Website">Website / Docs</option>
                  <option value="Course">Online Course (MOOC)</option>
                  <option value="Coding">Coding Platform</option>
                  <option value="Youtube">Video Platform</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#633BB3] hover:bg-[#522F9E] text-white text-xs font-bold cursor-pointer shadow-md"
                >
                  Create Platform
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
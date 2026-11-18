/* ========================================
   Gazi DOTT — Team Member Manager
   Static-first: local overrides + JSON fallback
   ======================================== */

// In-memory cache for team members
let _teamCache = null;
let _teamCacheTime = 0;
const TEAM_CACHE_TTL = 5000; // 5 seconds
const TEAM_STORAGE_KEY = 'dott-team-data';

function readStoredTeam() {
    try {
        const raw = localStorage.getItem(TEAM_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

function writeStoredTeam(team) {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(Array.isArray(team) ? team : []));
}

function normalizeTeamOrder(team) {
    return team
        .slice()
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((member, idx) => ({ ...member, order: idx }));
}

/**
 * Get all team members from local overrides or static JSON.
 */
async function getTeamMembers() {
    const now = Date.now();
    if (_teamCache && (now - _teamCacheTime) < TEAM_CACHE_TTL) {
        return _teamCache;
    }

    const stored = readStoredTeam();
    if (stored) {
        _teamCache = stored;
        _teamCacheTime = now;
        return _teamCache;
    }

    try {
        const response = await fetch('data/team.json');
        if (!response.ok) throw new Error('Failed to fetch team');
        _teamCache = await response.json();
        _teamCacheTime = now;
        return _teamCache;
    } catch (err) {
        console.error('Error fetching team:', err);
        return _teamCache || [];
    }
}

/**
 * Invalidate the team cache (call after mutations)
 */
function invalidateTeamCache() {
    _teamCache = null;
    _teamCacheTime = 0;
}

function setTeamMembersData(team) {
    const normalized = normalizeTeamOrder(Array.isArray(team) ? team : []);
    writeStoredTeam(normalized);
    _teamCache = normalized;
    _teamCacheTime = Date.now();
}

function resetTeamMembersData() {
    localStorage.removeItem(TEAM_STORAGE_KEY);
    invalidateTeamCache();
}

/**
 * Add a new team member
 */
async function addTeamMember(memberData) {
    const team = (await getTeamMembers()).slice();
    const created = {
        ...memberData,
        id: `member_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
        order: team.length
    };
    team.push(created);
    setTeamMembersData(team);
    return created;
}

/**
 * Update a team member
 */
async function updateTeamMember(id, data) {
    const team = (await getTeamMembers()).slice();
    const idx = team.findIndex(m => m.id === id);
    if (idx !== -1) {
        team[idx] = { ...team[idx], ...data, id, order: team[idx].order || 0 };
        setTeamMembersData(team);
        return team[idx];
    }
}

/**
 * Delete a team member
 */
async function deleteTeamMember(id) {
    const team = (await getTeamMembers()).filter(m => m.id !== id);
    setTeamMembersData(team);
}

/**
 * Move a team member up or down
 */
async function moveTeamMember(id, direction) {
    const team = normalizeTeamOrder(await getTeamMembers());
    const idx = team.findIndex(m => m.id === id);
    if (idx === -1) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= team.length) return;

    const tempOrder = team[idx].order;
    team[idx].order = team[swapIdx].order;
    team[swapIdx].order = tempOrder;
    setTeamMembersData(team);
}

/**
 * Get member name
 */
function getMemberName(member) {
    return member.name || '';
}

/**
 * Get member role based on current language
 */
function getMemberRole(member) {
    return currentLang === 'tr' ? (member.role_tr || member.role_en || '') : (member.role_en || member.role_tr || '');
}

function normalizeLinkedInUrl(value) {
    const trimmed = String(value || '').trim();
    if (!trimmed) return '';

    const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
        const url = new URL(candidate);
        const hostname = url.hostname.toLowerCase();
        if (hostname !== 'linkedin.com' && !hostname.endsWith('.linkedin.com')) return '';
        url.protocol = 'https:';
        url.username = '';
        url.password = '';
        url.port = '';
        return url.href;
    } catch {
        return '';
    }
}

const TEAM_GROUPS = [
    { id: 'leadership', icon: 'workspace_premium' },
    { id: 'organization', icon: 'event' },
    { id: 'design', icon: 'palette' },
    { id: 'social', icon: 'campaign' },
    { id: 'audit', icon: 'verified_user' },
];

/**
 * Resolve a member's group; infers one from the Turkish role for entries without a group field.
 */
function getMemberGroup(member) {
    if (TEAM_GROUPS.some(g => g.id === member.group)) return member.group;
    const role = (member.role_tr || '').toLocaleLowerCase('tr');
    if (role.includes('organizasyon')) return 'organization';
    if (role.includes('tasarım')) return 'design';
    if (role.includes('sosyal medya')) return 'social';
    if (role.includes('denetim') || role.includes('danışman')) return 'audit';
    return 'leadership';
}

function renderMemberCard(member, index, groupLabel) {
    const memberName = getMemberName(member);
    const safeName = escapeHTML(memberName);
    const safePhoto = escapeHTML(member.photo);
    const safeRole = escapeHTML(getMemberRole(member));
    const linkedInUrl = normalizeLinkedInUrl(member.linkedin);
    const safeLinkedInUrl = escapeHTML(linkedInUrl);
    const safeLinkedInLabel = escapeHTML(`${t('about.openLinkedIn')} — ${memberName}`);

    return `
        <article class="hud-panel card-hover group p-5">
            <div class="mb-5 flex items-center justify-between border-b border-border-dark/70 pb-3">
                <span class="text-[10px] font-bold uppercase text-text-muted">${escapeHTML(groupLabel)}</span>
                <span class="font-mono text-xs text-primary">${String(index + 1).padStart(2, '0')}</span>
            </div>
            <div class="flex items-center gap-4">
                ${member.photo
                    ? `<img src="${safePhoto}" alt="${safeName}" class="h-16 w-16 shrink-0 rounded-lg border border-primary/25 object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                       <div class="hidden h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
                           <span class="material-symbols-outlined text-[28px] text-primary">person</span>
                       </div>`
                    : `<div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10">
                           <span class="material-symbols-outlined text-[28px] text-primary">person</span>
                       </div>`
                }
                <div class="min-w-0 flex-1 text-left">
                    <h3 class="truncate text-base font-bold text-white transition-colors group-hover:text-primary" title="${safeName}">${safeName}</h3>
                    <p class="mt-1 text-sm font-medium text-text-muted">${safeRole}</p>
                </div>
                ${linkedInUrl ? `
                    <a href="${safeLinkedInUrl}" target="_blank" rel="noopener noreferrer"
                        class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#0a66c2]/50 bg-[#0a66c2]/10 text-[#70b5f9] transition-colors hover:border-[#70b5f9] hover:bg-[#0a66c2]/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#70b5f9] focus:ring-offset-2 focus:ring-offset-card-dark"
                        aria-label="${safeLinkedInLabel}" title="LinkedIn">
                        <svg aria-hidden="true" viewBox="0 0 24 24" class="h-[18px] w-[18px] fill-current">
                            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V8.98h3.42v1.57h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.32 7.41a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.04H3.54V8.98H7.1v11.47ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z"/>
                        </svg>
                    </a>` : ''}
            </div>
        </article>`;
}

/**
 * Render team members on the About page, grouped by unit
 */
async function renderTeamMembers() {
    const container = document.getElementById('team-grid');
    if (!container) return;

    const members = (await getTeamMembers()).slice();
    members.sort((a, b) => (a.order || 0) - (b.order || 0));

    if (members.length === 0) {
        container.innerHTML = `
            <div class="hud-panel-muted flex min-h-52 flex-col items-center justify-center px-6 py-12 text-center text-text-muted">
                <span class="material-symbols-outlined mb-3 block text-4xl text-primary">group</span>
                <p class="text-sm">${currentLang === 'tr' ? 'Ekip bilgileri yakında eklenecektir.' : 'Team information will be added soon.'}</p>
            </div>`;
        return;
    }

    container.innerHTML = TEAM_GROUPS.map(group => {
        const groupMembers = members.filter(m => getMemberGroup(m) === group.id);
        if (groupMembers.length === 0) return '';
        const groupLabel = t(`about.group.${group.id}`);

        return `
        <section aria-labelledby="team-group-${group.id}">
            <div class="mb-4 flex items-center gap-3">
                <span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                    <span class="material-symbols-outlined text-[20px]">${group.icon}</span>
                </span>
                <h3 id="team-group-${group.id}" class="text-lg font-bold text-white">${escapeHTML(groupLabel)}</h3>
                <span class="font-mono text-xs text-text-muted">${String(groupMembers.length).padStart(2, '0')}</span>
                <span class="h-px flex-1 bg-border-dark/70" aria-hidden="true"></span>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                ${groupMembers.map((member, index) => renderMemberCard(member, index, groupLabel)).join('')}
            </div>
        </section>`;
    }).join('');
}

// (export handled in admin.js for static mode)

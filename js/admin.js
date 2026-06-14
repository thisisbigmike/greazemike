// js/admin.js
// Auth + CRUD for the portfolio admin panel.
// Only logged-in users (you) can create/update/delete. Row Level Security
// in Supabase enforces this server-side even if someone edits this file.

const els = {};
let editingId = null;
let csEditingId = null;

document.addEventListener('DOMContentLoaded', () => {
    // Cache elements
    [
        'login-view', 'admin-view', 'login-form', 'login-password',
        'login-error', 'logout-btn', 'project-form', 'form-title', 'form-error',
        'project-list', 'reset-btn', 'image-file', 'current-image',
        'f-title', 'f-tag', 'f-description', 'f-site_url', 'f-twitter_url',
        'f-discord_url', 'f-telegram_url', 'f-sort_order',
        // Case studies
        'cs-form', 'cs-form-title', 'cs-form-error', 'cs-list', 'cs-reset-btn',
        'cs-image-file', 'cs-current-image', 'cs-title', 'cs-description',
        'cs-role', 'cs-tech_stack', 'cs-features', 'cs-challenge', 'cs-live_url',
        'cs-sort_order',
    ].forEach(id => { els[id] = document.getElementById(id); });

    els['login-form'].addEventListener('submit', handleLogin);
    els['logout-btn'].addEventListener('click', handleLogout);
    els['project-form'].addEventListener('submit', handleSave);
    els['reset-btn'].addEventListener('click', resetForm);
    els['cs-form'].addEventListener('submit', handleCsSave);
    els['cs-reset-btn'].addEventListener('click', resetCsForm);

    // React to auth state on load and on change.
    supabaseClient.auth.onAuthStateChange((_event, session) => {
        renderAuth(session);
    });
    supabaseClient.auth.getSession().then(({ data }) => renderAuth(data.session));
});

function renderAuth(session) {
    if (session) {
        els['login-view'].classList.add('hidden');
        els['admin-view'].classList.remove('hidden');
        loadList();
        loadCsList();
    } else {
        els['admin-view'].classList.add('hidden');
        els['login-view'].classList.remove('hidden');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    els['login-error'].textContent = '';
    const passcode = els['login-password'].value;
    // Fixed email + the typed passcode = the Supabase user's credentials.
    const { error } = await supabaseClient.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: passcode,
    });
    if (error) els['login-error'].textContent = 'Wrong passcode.';
}

async function handleLogout() {
    await supabaseClient.auth.signOut();
}

// ---- List ----
async function loadList() {
    const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

    if (error) { els['project-list'].innerHTML = `<p class="text-red-400">${error.message}</p>`; return; }

    if (!data.length) { els['project-list'].innerHTML = `<p class="text-slate-400">No projects yet.</p>`; return; }

    els['project-list'].innerHTML = data.map(p => `
        <div class="flex items-center gap-4 border border-gold-300/20 p-3 bg-panel">
            <img src="${p.image_url || 'https://via.placeholder.com/80'}" alt="" class="w-16 h-16 object-cover flex-shrink-0">
            <div class="flex-1 min-w-0">
                <p class="text-white font-serif truncate">${escapeHtml(p.title)}</p>
                <p class="text-slate-400 text-xs truncate">${escapeHtml(p.tag || '')} &middot; order ${p.sort_order ?? 0}</p>
            </div>
            <button data-edit="${p.id}" class="text-gold-100 hover:text-white text-sm uppercase tracking-wider">Edit</button>
            <button data-del="${p.id}" class="text-red-400 hover:text-red-300 text-sm uppercase tracking-wider">Delete</button>
        </div>
    `).join('');

    els['project-list'].querySelectorAll('[data-edit]').forEach(b =>
        b.addEventListener('click', () => startEdit(b.dataset.edit, data)));
    els['project-list'].querySelectorAll('[data-del]').forEach(b =>
        b.addEventListener('click', () => handleDelete(b.dataset.del)));
}

function startEdit(id, data) {
    const p = data.find(x => String(x.id) === String(id));
    if (!p) return;
    editingId = p.id;
    els['form-title'].textContent = 'Edit Project';
    els['f-title'].value = p.title || '';
    els['f-tag'].value = p.tag || '';
    els['f-description'].value = p.description || '';
    els['f-site_url'].value = p.site_url || '';
    els['f-twitter_url'].value = p.twitter_url || '';
    els['f-discord_url'].value = p.discord_url || '';
    els['f-telegram_url'].value = p.telegram_url || '';
    els['f-sort_order'].value = p.sort_order ?? 0;
    els['current-image'].textContent = p.image_url ? 'Current image set. Upload to replace.' : 'No image yet.';
    els['image-file'].value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    editingId = null;
    els['project-form'].reset();
    els['form-title'].textContent = 'Add Project';
    els['form-error'].textContent = '';
    els['current-image'].textContent = '';
}

// ---- Image upload ----
async function uploadImage(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabaseClient.storage
        .from(PROJECTS_BUCKET)
        .upload(path, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data } = supabaseClient.storage.from(PROJECTS_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}

// ---- Save (create or update) ----
async function handleSave(e) {
    e.preventDefault();
    els['form-error'].textContent = '';
    const btn = els['project-form'].querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
        const record = {
            title: els['f-title'].value.trim(),
            tag: els['f-tag'].value.trim(),
            description: els['f-description'].value.trim(),
            site_url: els['f-site_url'].value.trim() || null,
            twitter_url: els['f-twitter_url'].value.trim() || null,
            discord_url: els['f-discord_url'].value.trim() || null,
            telegram_url: els['f-telegram_url'].value.trim() || null,
            sort_order: parseInt(els['f-sort_order'].value, 10) || 0,
        };

        const file = els['image-file'].files[0];
        if (file) record.image_url = await uploadImage(file);

        let error;
        if (editingId) {
            ({ error } = await supabaseClient.from('projects').update(record).eq('id', editingId));
        } else {
            ({ error } = await supabaseClient.from('projects').insert(record));
        }
        if (error) throw error;

        resetForm();
        loadList();
    } catch (err) {
        els['form-error'].textContent = err.message || 'Save failed.';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Save Project';
    }
}

async function handleDelete(id) {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    const { error } = await supabaseClient.from('projects').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    if (String(editingId) === String(id)) resetForm();
    loadList();
}

// ============================ CASE STUDIES ============================

async function loadCsList() {
    const { data, error } = await supabaseClient
        .from('case_studies')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

    if (error) { els['cs-list'].innerHTML = `<p class="text-red-400">${error.message}</p>`; return; }
    if (!data.length) { els['cs-list'].innerHTML = `<p class="text-slate-400">No case studies yet.</p>`; return; }

    els['cs-list'].innerHTML = data.map(c => `
        <div class="flex items-center gap-4 border border-gold-300/20 p-3 bg-panel">
            <img src="${c.image_url || 'https://via.placeholder.com/80'}" alt="" class="w-16 h-16 object-cover flex-shrink-0">
            <div class="flex-1 min-w-0">
                <p class="text-white font-serif truncate">${escapeHtml(c.title)}</p>
                <p class="text-slate-400 text-xs truncate">${escapeHtml(c.role || '')} &middot; order ${c.sort_order ?? 0}</p>
            </div>
            <button data-csedit="${c.id}" class="text-gold-100 hover:text-white text-sm uppercase tracking-wider">Edit</button>
            <button data-csdel="${c.id}" class="text-red-400 hover:text-red-300 text-sm uppercase tracking-wider">Delete</button>
        </div>
    `).join('');

    els['cs-list'].querySelectorAll('[data-csedit]').forEach(b =>
        b.addEventListener('click', () => startCsEdit(b.dataset.csedit, data)));
    els['cs-list'].querySelectorAll('[data-csdel]').forEach(b =>
        b.addEventListener('click', () => handleCsDelete(b.dataset.csdel)));
}

function startCsEdit(id, data) {
    const c = data.find(x => String(x.id) === String(id));
    if (!c) return;
    csEditingId = c.id;
    els['cs-form-title'].textContent = 'Edit Case Study';
    els['cs-title'].value = c.title || '';
    els['cs-description'].value = c.description || '';
    els['cs-role'].value = c.role || '';
    els['cs-tech_stack'].value = c.tech_stack || '';
    els['cs-features'].value = c.features || '';
    els['cs-challenge'].value = c.challenge || '';
    els['cs-live_url'].value = c.live_url || '';
    els['cs-sort_order'].value = c.sort_order ?? 0;
    els['cs-current-image'].textContent = c.image_url ? 'Current image set. Upload to replace.' : 'No image yet.';
    els['cs-image-file'].value = '';
    els['cs-form'].scrollIntoView({ behavior: 'smooth' });
}

function resetCsForm() {
    csEditingId = null;
    els['cs-form'].reset();
    els['cs-form-title'].textContent = 'Add Case Study';
    els['cs-form-error'].textContent = '';
    els['cs-current-image'].textContent = '';
}

async function handleCsSave(e) {
    e.preventDefault();
    els['cs-form-error'].textContent = '';
    const btn = els['cs-form'].querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
        const record = {
            title: els['cs-title'].value.trim(),
            description: els['cs-description'].value.trim(),
            role: els['cs-role'].value.trim() || null,
            tech_stack: els['cs-tech_stack'].value.trim() || null,
            features: els['cs-features'].value.trim() || null,
            challenge: els['cs-challenge'].value.trim() || null,
            live_url: els['cs-live_url'].value.trim() || null,
            sort_order: parseInt(els['cs-sort_order'].value, 10) || 0,
        };

        const file = els['cs-image-file'].files[0];
        if (file) record.image_url = await uploadImage(file);

        let error;
        if (csEditingId) {
            ({ error } = await supabaseClient.from('case_studies').update(record).eq('id', csEditingId));
        } else {
            ({ error } = await supabaseClient.from('case_studies').insert(record));
        }
        if (error) throw error;

        resetCsForm();
        loadCsList();
    } catch (err) {
        els['cs-form-error'].textContent = err.message || 'Save failed.';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Save Case Study';
    }
}

async function handleCsDelete(id) {
    if (!confirm('Delete this case study? This cannot be undone.')) return;
    const { error } = await supabaseClient.from('case_studies').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    if (String(csEditingId) === String(id)) resetCsForm();
    loadCsList();
}

function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

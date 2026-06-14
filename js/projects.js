// js/projects.js
// Fetches projects from Supabase and renders portfolio cards into #portfolio-grid.
// Matches the existing gold/serif vintage card markup.

function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Build one social icon link only when a URL is present.
function socialLink(url, iconClass) {
    if (!url) return '';
    return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener"
        class="text-slate-500 hover:text-gold-100 transition-colors"><i class="${iconClass} text-lg"></i></a>`;
}

function projectCard(p, index) {
    const delay = index % 2 === 1 ? ' data-aos-delay="100"' : '';
    const placeholder = `https://via.placeholder.com/800x600/2a241c/A08050?text=${encodeURIComponent(p.title || 'Project')}`;
    const img = p.image_url || placeholder;

    const visit = p.site_url
        ? `<a href="${escapeHtml(p.site_url)}" target="_blank" rel="noopener"
             class="text-gold-100 hover:text-white border-b border-gold-300 pb-1 text-sm uppercase tracking-wider transition-colors">
             Visit Site
           </a>`
        : '';

    const socials = [
        socialLink(p.twitter_url, 'fab fa-x-twitter'),
        socialLink(p.discord_url, 'fab fa-discord'),
        socialLink(p.telegram_url, 'fab fa-telegram'),
    ].join('');

    return `
    <div class="group" data-aos="fade-up"${delay}>
        <div class="relative overflow-hidden border-2 border-gold-300/30 p-2">
            <div class="relative h-64 overflow-hidden bg-panel">
                <div class="absolute inset-0 bg-gold-300/10 group-hover:bg-transparent transition-all z-10"></div>
                <img src="${escapeHtml(img)}"
                    onerror="this.src='${placeholder}'"
                    alt="${escapeHtml(p.title)}"
                    class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 sepia-[.2]">
            </div>
        </div>
        <div class="mt-6 text-center md:text-left">
            <span class="text-xs font-bold text-gold-200 uppercase tracking-widest border border-gold-300 px-2 py-1">${escapeHtml(p.tag || 'Project')}</span>
            <h3 class="text-2xl font-serif font-bold text-white mt-4 mb-2">${escapeHtml(p.title)}</h3>
            <p class="text-slate-400 text-sm mb-4 leading-relaxed max-w-md">${escapeHtml(p.description)}</p>
            <div class="flex items-center gap-4 flex-wrap">
                ${visit}
                <div class="flex items-center gap-3">${socials}</div>
            </div>
        </div>
    </div>`;
}

async function loadProjects() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;

    const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Failed to load projects:', error);
        grid.innerHTML = `<p class="text-slate-400 col-span-full text-center">Could not load projects.</p>`;
        return;
    }

    if (!data || data.length === 0) {
        grid.innerHTML = `<p class="text-slate-400 col-span-full text-center">No projects yet.</p>`;
        return;
    }

    grid.innerHTML = data.map(projectCard).join('');

    // Refresh AOS so newly injected cards animate.
    if (window.AOS) window.AOS.refresh();
}

document.addEventListener('DOMContentLoaded', loadProjects);

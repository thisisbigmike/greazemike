// js/case-studies.js
// Renders case studies locally from CASE_STUDIES_DATA.
// Layout alternates: even index = image left, odd index = image right.

const CASE_STUDIES_DATA = [
    {
        title: "OneRaise",
        description: "A professional cross-border crypto crowdfunding platform enabling USDT donations across TRC20, ERC20, and BEP20 networks. The application integrates real-time campaign stats and automated deposit verification.",
        image_url: "images/image.png",
        role: "Full-Stack Engineer",
        tech_stack: "Next.js, TypeScript, Node.js, Busha API, MoonPay, Express",
        features: "Multi-network USDT donation support (TRC20, ERC20, BEP20)\nReal-time payment tracking & webhook verification via Busha API\nSeamless fiat-to-crypto integration via MoonPay on-ramp\nDynamic responsive campaign pages and donor leaderboards",
        challenge: "Verifying multi-chain USDT deposits securely without exposing private keys or relying on slow manual reconciliation. Handled this by architecting a Node.js API server to process secure webhooks from Busha, performing cryptographic signature checks, and broadcasting updates over WebSockets.",
        live_url: "https://oneraise.vercel.app/"
    },
    {
        title: "Deriverse Dashboard",
        description: "A professional on-chain trading analytics platform built for DeFi traders on the Solana ecosystem. The dashboard provides real-time portfolio tracking, P&L analysis, drawdown metrics, and historical trade logs.",
        image_url: "images/deriverse.png",
        role: "Full-Stack Engineer",
        tech_stack: "Next.js 16, TypeScript, Prisma, PostgreSQL, NextAuth v5, Solana Web3.js, Gemini API",
        features: "Real-time portfolio P&L tracking with live cryptocurrency price feeds\nWallet-based authentication with Solana Wallet Adapter\nAI-powered trading assistant integrated with Google Gemini API\nDrawdown heatmaps and automated Sharpe ratio performance calculation",
        challenge: "Aggregating and processing high-frequency Solana perp trading events while maintaining sub-second UI response times. Solved this by setting up a robust polling and caching layer, database indices on wallet address queries, and an optimized Prisma schema.",
        live_url: "https://deriversedashboard.vercel.app/"
    }
];

function csEscape(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// One feature per line -> list rows with a uniform gold check icon.
function featureRows(features) {
    const lines = String(features || '')
        .split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) return '';
    const rows = lines.map(line => `
        <div class="flex items-start gap-3">
            <i class="fas fa-check text-gold-100 mt-1 text-sm"></i>
            <p class="text-sm text-slate-400">${csEscape(line)}</p>
        </div>`).join('');
    return `
        <div class="mb-6">
            <p class="text-xs text-gold-200 uppercase tracking-widest mb-3">Key Features</p>
            <div class="space-y-2">${rows}</div>
        </div>`;
}

function imageBlock(cs, imageLeft) {
    const placeholder = `https://placehold.co/800x500/2a241c/A08050?text=${encodeURIComponent(cs.title || 'Case Study')}`;
    const img = cs.image_url || placeholder;
    const cornerPos = imageLeft ? 'top-3 -left-3' : 'top-3 -right-3';
    const order = imageLeft ? '' : ' order-1 lg:order-2';
    return `
        <div class="relative group${order}">
            <div class="absolute ${cornerPos} w-full h-full border border-gold-300/40 z-0 hidden sm:block"></div>
            <img src="${csEscape(img)}"
                onerror="this.onerror=null;this.src='${placeholder}'"
                alt="${csEscape(cs.title)}"
                class="relative z-10 w-full object-cover shadow-2xl sepia-[.15] brightness-95 contrast-110 border border-gold-300/20">
        </div>`;
}

function detailsBlock(cs, imageLeft) {
    const order = imageLeft ? '' : ' order-2 lg:order-1';
    const roleStack = (cs.role || cs.tech_stack) ? `
        <div class="grid grid-cols-2 gap-6 mb-6">
            <div>
                <p class="text-xs text-gold-200 uppercase tracking-widest mb-1">My Role</p>
                <p class="text-sm text-slate-300">${csEscape(cs.role)}</p>
            </div>
            <div>
                <p class="text-xs text-gold-200 uppercase tracking-widest mb-1">Tech Stack</p>
                <p class="text-sm text-slate-300">${csEscape(cs.tech_stack)}</p>
            </div>
        </div>` : '';

    const challenge = cs.challenge ? `
        <div class="border-l-2 border-gold-200 pl-4 mb-6">
            <p class="text-xs text-gold-200 uppercase tracking-widest mb-1">Challenge & Solution</p>
            <p class="text-sm text-slate-400 leading-relaxed">${csEscape(cs.challenge)}</p>
        </div>` : '';

    const cta = cs.live_url ? `
        <a href="${csEscape(cs.live_url)}" target="_blank" rel="noopener"
            class="inline-block px-6 py-3 border border-gold-200 text-gold-100 text-sm font-serif tracking-widest hover:bg-gold-200 hover:text-noir transition-all duration-500 uppercase">
            View Live Project
        </a>` : '';

    return `
        <div class="${order}">
            <span class="text-xs font-bold text-gold-200 uppercase tracking-widest border border-gold-300 px-3 py-1">Case Study</span>
            <h3 class="text-2xl sm:text-3xl font-serif font-bold text-white mt-6 mb-4">${csEscape(cs.title)}</h3>
            <p class="text-slate-400 leading-relaxed mb-6">${csEscape(cs.description)}</p>
            ${roleStack}
            ${featureRows(cs.features)}
            ${challenge}
            ${cta}
        </div>`;
}

function caseStudyBlock(cs, index, isLast) {
    const imageLeft = index % 2 === 0;
    const inner = imageLeft
        ? imageBlock(cs, true) + detailsBlock(cs, true)
        : detailsBlock(cs, false) + imageBlock(cs, false);
    const divider = isLast ? '' : `<div class="h-px w-full bg-gold-300/20 mb-20"></div>`;
    return `
        <div class="mb-20" data-aos="fade-up">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                ${inner}
            </div>
        </div>
        ${divider}`;
}

function loadCaseStudies() {
    const wrap = document.getElementById('case-studies-list');
    if (!wrap) return;

    wrap.innerHTML = CASE_STUDIES_DATA.map((cs, i) => caseStudyBlock(cs, i, i === CASE_STUDIES_DATA.length - 1)).join('');
    if (window.AOS) window.AOS.refresh();
}

document.addEventListener('DOMContentLoaded', loadCaseStudies);

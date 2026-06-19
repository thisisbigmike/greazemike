// js/projects.js
// Renders engineering projects with multiple tech stack badges and links.

const PROJECTS_DATA = [
    {
        title: "OneRaise",
        tag: "Crypto Crowdfunding Platform",
        tags: ["Next.js", "TypeScript", "Node.js", "Busha API", "MoonPay"],
        description: "Full-stack Next.js application enabling USDT donations across TRC20, ERC20, and BEP20 networks. Integrated Busha payment API with webhook verification, MoonPay fiat on-ramp, real-time donation tracking, and responsive campaign pages.",
        site_url: "https://oneraise.vercel.app/",
        github_url: "https://github.com/thisisbigmike/oneraise",
        image_url: "images/image.png"
    },
    {
        title: "Deriverse Dashboard",
        tag: "Trading Analytics for Solana Perps",
        tags: ["Next.js 16", "TypeScript", "Prisma", "PostgreSQL", "NextAuth v5", "Solana"],
        description: "Professional analytics dashboard for Deriverse DEX traders. Features P&L tracking, drawdown analysis, performance heatmaps, Sharpe ratio calculations, live crypto price feeds, Solana wallet integration, and an AI trading assistant powered by Gemini.",
        site_url: "https://deriversedashboard.vercel.app/",
        github_url: "https://github.com/thisisbigmike/deriverse-dashboard",
        image_url: "images/deriverse.png"
    },
    {
        title: "Smart Transaction Stack",
        tag: "Solana Transaction Infrastructure",
        tags: ["Rust", "Solana", "WebSocket", "Jito"],
        description: "Production-ready Rust toolkit for building, signing, and monitoring Solana transactions via Jito bundles. Includes WebSocket-based transaction tracking and AI-driven recovery for failed transactions.",
        site_url: "",
        github_url: "https://github.com/thisisbigmike/smart-transaction-stack",
        image_url: ""
    },
    {
        title: "Agent Greaze",
        tag: "AI Agent for Cross-Border Crypto Payments",
        tags: ["TypeScript", "Solana", "Yellow Card API", "AI"],
        description: "Conversational agent where users send natural language commands to transfer USDC on Solana with automatic conversion to local currency via Yellow Card. Handles the full pipeline: intent parsing → on-chain transfer → fiat off-ramp.",
        site_url: "",
        github_url: "https://github.com/thisisbigmike/agent-greaze",
        image_url: ""
    },
    {
        title: "GreasyLP",
        tag: "Solana LP Security Suite",
        tags: ["JavaScript", "Solana", "LPAgent API"],
        description: "DeFi security platform with a transaction firewall (LPGuard) and position health analyzer (Position Doctor) for Solana liquidity providers. Powered by the LPAgent API.",
        site_url: "",
        github_url: "https://github.com/thisisbigmike/greasy-lp",
        image_url: ""
    },
    {
        title: "Agentic Wallets",
        tag: "Autonomous AI Agent Dashboard",
        tags: ["TypeScript", "Next.js", "Solana", "OpenClaw LLM"],
        description: "Live dashboard for observing AI agents autonomously transacting on Solana Devnet. Integrated with OpenClaw LLM for AI-driven on-chain decision making with real-time activity visualization.",
        site_url: "",
        github_url: "https://github.com/thisisbigmike/agentic-wallets",
        image_url: ""
    }
];

function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function projectCard(p, index) {
    const delay = index % 2 === 1 ? ' data-aos-delay="100"' : '';
    const placeholder = `https://placehold.co/800x500/100f0d/A08050?text=${encodeURIComponent(p.title || 'Project')}`;
    const img = p.image_url || placeholder;

    const visitLink = p.site_url
        ? `<a href="${escapeHtml(p.site_url)}" target="_blank" rel="noopener"
             class="text-gold-100 hover:text-white border-b border-gold-300 pb-0.5 text-xs uppercase tracking-wider transition-colors flex items-center gap-1 font-serif italic">
             Visit Site <i class="fas fa-external-link-alt text-[10px]"></i>
           </a>`
        : '';

    const githubLink = p.github_url
        ? `<a href="${escapeHtml(p.github_url)}" target="_blank" rel="noopener"
             class="text-gold-100 hover:text-white border-b border-gold-300 pb-0.5 text-xs uppercase tracking-wider transition-colors flex items-center gap-1 font-serif italic">
             GitHub <i class="fab fa-github text-[10px]"></i>
           </a>`
        : '';

    const tagsMarkup = (p.tags || [])
        .map(t => `<span class="text-[10px] font-bold text-gold-200 uppercase tracking-widest border border-gold-300/30 px-2.5 py-1 bg-gold-300/5 backdrop-blur-sm rounded-sm">${escapeHtml(t)}</span>`)
        .join('');

    return `
    <div class="group bg-panel/30 border border-gold-300/10 p-4 transition-all duration-500 hover:border-gold-300/30 hover:bg-panel/50" data-aos="fade-up"${delay}>
        <div class="relative overflow-hidden border border-gold-300/20 p-1 bg-vintage">
            <div class="relative h-56 overflow-hidden bg-noir">
                <div class="absolute inset-0 bg-gold-300/5 group-hover:bg-transparent transition-all z-10"></div>
                <img src="${escapeHtml(img)}"
                    onerror="this.onerror=null;this.src='${placeholder}'"
                    alt="${escapeHtml(p.title)}"
                    class="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-700 sepia-[.1] brightness-90">
            </div>
        </div>
        <div class="mt-6">
            <p class="text-xs font-bold text-gold-200 uppercase tracking-widest mb-1 italic">${escapeHtml(p.tag || 'Project')}</p>
            <h3 class="text-2xl font-serif font-bold text-white mb-3">${escapeHtml(p.title)}</h3>
            <p class="text-slate-400 text-sm mb-5 leading-relaxed font-light min-h-[72px]">${escapeHtml(p.description)}</p>
            
            <!-- Tech Stack Tags -->
            <div class="flex flex-wrap gap-2 mb-6">
                ${tagsMarkup}
            </div>

            <!-- Links -->
            <div class="flex items-center gap-6">
                ${visitLink}
                ${githubLink}
            </div>
        </div>
    </div>`;
}

function loadProjects() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;

    // Direct render from local high-quality array to ensure CV alignment is perfect
    grid.innerHTML = PROJECTS_DATA.map(projectCard).join('');

    if (window.AOS) window.AOS.refresh();
}

document.addEventListener('DOMContentLoaded', loadProjects);

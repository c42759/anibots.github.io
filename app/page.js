"use client";

import { useState } from "react";

const GITHUB_REPO = "https://github.com/c42759/AniBots/";
const GITHUB_DISCUSSIONS = "https://github.com/c42759/AniBots/discussions";
const GITHUB_ISSUES = "https://github.com/c42759/AniBots/issues";
const DISCORD_WIDGET_SRC = "https://discord.com/widget?id=1544679075463823430&theme=dark";

const CONTRIBUTOR_ROLES = [
  {
    id: "pixel-art",
    title: "Pixel Artists & 2D Illustrators",
    badge: "Visual / 2D",
    tagline: "Bring retro-tactical mechas and chibi overworld characters to life.",
    description:
      "AniBots draws inspiration from Pokémon BDSP chibi proportions in the overworld and high-tactile robot battlers like Medabots GBA. We need artists to shape our chassis frames, character sprites, and combat arenas.",
    deliverables: [
      "5-Part modular robot chassis sprites (Head, Torso, Left Arm, Right Arm, Legs)",
      "Layered composite chibi player customization sprites (hairstyles, clothing, skin tones)",
      "Anima Chip schematic illustrations and ink sketch icons",
      "Dynamic 2D battle arena backgrounds (City, Junkyard, Badlands, Sub-Zero Ridge)",
    ],
    techStack: ["Aseprite / PyxelEdit / Photoshop", "Indexed color palettes", "PNG Sprite Sheets (32x32 / 64x64)"],
    issueLink: GITHUB_ISSUES,
    issueLabel: "role: 2D & Pixel Art",
  },
  {
    id: "3d-art",
    title: "3D Modelers & Animators",
    badge: "Mesh / Animation",
    tagline: "Build swappable chassis parts and dynamic combat animations for Godot 4.x.",
    description:
      "Our target engine is Godot 4.x (GL Compatibility / Desktop & Mobile). We are developing modular 3D robot frames where components snap into standard sockets, paired with punchy combat animations for the 3-Phase ATB combat pipeline.",
    deliverables: [
      "Modular 3D chassis meshes with unified socket rigging (Head, Torso, Arms, Legs)",
      "Keyframe combat animations: Sprint Run, Payload Execution, Latency Return, Stagger/Knockout",
      "VFX meshes & shaders: Plasma beams, kinetic impacts, logic barrier shields",
      "Battle arena 3D dioramas and environmental props",
    ],
    techStack: ["Blender", "glTF 2.0 / GLB export pipeline", "Low / Mid-Poly optimization for Godot"],
    issueLink: GITHUB_ISSUES,
    issueLabel: "role: 3D & Animation",
  },
  {
    id: "devs",
    title: "Software & Game Developers",
    badge: "Godot / Engine",
    tagline: "Architect GDScript gameplay systems, AI targeting, and SQLite persistence.",
    description:
      "AniBots runs on a clean architecture: Event Bus decoupling (SignalBus), Autoload managers, dual SQLite databases (Catalog + ACID Save state), and a weighted utility AI targeting loop.",
    deliverables: [
      "GDScript 2.0 core mechanics and 3-Phase ATB relay state machines",
      "Autonomous Anima Chip Utility AI threat scoring algorithms",
      "Dual SQLite database queries and save state migrations",
      "Full controller / keyboard input mapping and game loop polish",
    ],
    techStack: ["Godot 4.x (GDScript 2.0 strict typing)", "SQLite (godot-sqlite)", "Git / GitHub Actions"],
    issueLink: GITHUB_ISSUES,
    issueLabel: "role: Game Dev",
  },
  {
    id: "ui-ux",
    title: "UI / UX Designers",
    badge: "Interface",
    tagline: "Craft diegetic garage part-swapping screens and responsive combat HUDs.",
    description:
      "Players act as Handlers managing complex hardware stats: Integrity, Condition, Payload, Latency, Clock Speed, and Weight limits. We need intuitive, retro-futuristic interfaces that make hardware customization effortless and satisfying.",
    deliverables: [
      "AniBot Garage Assembly UI (Medabots-style modular 5-slot inspector)",
      "Battle HUD: Dynamic 3-Phase ATB relay action bars, part HP cards, targeting indicators",
      "Overworld menus: Save slot selectors, character customizer, shopkeeper trade modals",
      "Godot Control theme styling & responsive screen layout design",
    ],
    techStack: ["Figma / Penpot", "Godot Control node theming", "Tailwind CSS (for web companion AniDex)"],
    issueLink: GITHUB_ISSUES,
    issueLabel: "role: UI / UX",
  },
  {
    id: "lore-audio",
    title: "Writers, Designers & Audio Composers",
    badge: "Lore & Sound",
    tagline: "Compose chiptune OSTs, servo SFX, and expand the 3047 AD story universe.",
    description:
      "From the mysterious Generation 0 Ancient Cores to the Anode Group badlands syndicate, AniBots features a rich story bible. We are also building an energetic hybrid OST and tactile robotic soundscapes.",
    deliverables: [
      "Anima Chip personality dialogue engrams, battle haikus, and quest scenarios",
      "Combat balancing: Part stat scaling, scrap economy math, terrain matrices",
      "Original cyberpunk/chiptune battle soundtracks and ambient city loops",
      "Robotic SFX: Servos, hydraulic steps, energy charging, laser blasts, shield overrides",
    ],
    techStack: ["FL Studio / Ableton / Reaper", "SFX pooling in Godot", "Markdown World Bible"],
    issueLink: GITHUB_DISCUSSIONS,
    issueLabel: "role: Lore & Audio",
  },
];

const MODULAR_SLOTS = [
  {
    name: "HEAD",
    role: "Tactical Burst & Win Condition",
    mechanic: "Houses high-impact utility (Logic Bombs, Scanners, Shields). Limited Cache charges. Reaching 0 HP triggers System Failure (Defeat).",
    statFocus: "Finite Cache memory (2-4 uses), Critical Scanners, Emergency Shields",
    tag: "Win Condition",
  },
  {
    name: "TORSO",
    role: "Motherboard Chassis & Heat Dissipation",
    mechanic: "Structural backbone providing Max Loadout weight tolerance, passive Firewall armor, and Cooling rate that lowers weapon cooldowns.",
    statFocus: "Max Loadout (Weight Bandwidth), Firewall Mitigation, Thermal Cooling",
    tag: "Chassis Core",
  },
  {
    name: "LEFT ARM",
    role: "Active Weapon / Shield / Utility",
    mechanic: "Primary offensive or defensive limb. Infinite usage. Melee weapons retarget dynamically at the center line; ranged weapons lock in advance.",
    statFocus: "Payload Power, Precision Accuracy, Execution Charge, Latency Return",
    tag: "Active Weapon",
  },
  {
    name: "RIGHT ARM",
    role: "Active Weapon / Shield / Utility",
    mechanic: "Secondary limb. Can dual-wield balanced weapons or mount super-heavy siege howitzers and barrier shields.",
    statFocus: "Payload Power, Precision Accuracy, Execution Charge, Latency Return",
    tag: "Active Weapon",
  },
  {
    name: "LEGS",
    role: "Propulsion Platform & Terrain Protocol",
    mechanic: "Dictates Action Bar fill speed (Clock Speed), evasion (Packet Loss), and terrain compatibility across Bipedal, Wheeled, Tracks, Hover, Aquatic, and Multi-Leg.",
    statFocus: "Clock Speed (Wait Phase fill), Packet Loss Evasion, Terrain Protocol",
    tag: "Mobility",
  },
];

const CHIP_SERIES = [
  {
    series: "Antiquity Series",
    count: "12 Cores",
    color: "from-amber-500/20 to-amber-600/10 border-amber-500/40 text-amber-300",
    summary: "Programmed after historical martial disciplines: Ronin, Dragoon, Spartan Phalanx, Corsair, Artificer, Gunslinger, and Berserker.",
  },
  {
    series: "Kinetic Series",
    count: "12 Cores",
    color: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/40 text-cyan-300",
    summary: "Industrial and elemental engines: Spark, Magma, Cryo-Frost, Gale, Seismic Terra, Hydro-Torrent, and Caustic Corrosive.",
  },
  {
    series: "Astral Series",
    count: "12 Cores",
    color: "from-purple-500/20 to-purple-600/10 border-purple-500/40 text-purple-300",
    summary: "Rare celestial matrices: Orion Sniper, Gemini Dual-Wield, Ursa Guardian, Draco Overclock, and Leo Sovereign.",
  },
  {
    series: "Ancient Series (Gen 0)",
    count: "10 Cores",
    color: "from-rose-500/20 to-rose-600/10 border-rose-500/40 text-rose-300",
    summary: "Legendary pre-war archetypes: Vulpes Zerda, Agon Vanguard, Biggon Colossus, Cygon Cipher, and the 7 Animal Ancients.",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(CONTRIBUTOR_ROLES[0].id);
  const [activeSlot, setActiveSlot] = useState(0);

  const selectedRole = CONTRIBUTOR_ROLES.find((r) => r.id === activeTab) || CONTRIBUTOR_ROLES[0];

  return (
    <div className="flex flex-col min-h-screen bg-[#070b12] text-slate-100 cyber-grid relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-cyan-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[300px] bg-amber-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#070b12]/85 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-cyan-400 bg-cyan-950/60 flex items-center justify-center relative">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-diode-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-lg font-bold tracking-wider text-cyan-400">ANIBOTS</span>
              <span className="text-[10px] text-slate-400 -mt-1 font-mono uppercase tracking-widest">Tactical Mecha RPG</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#overview" className="hover:text-cyan-400 transition-colors">Overview</a>
            <a href="#modular-system" className="hover:text-cyan-400 transition-colors">Modular Systems</a>
            <a href="#contributors" className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
              Contributors Wanted
            </a>
            <a href="#onboarding" className="hover:text-cyan-400 transition-colors">How to Join</a>
            <a href="#community" className="hover:text-cyan-400 transition-colors">Community & Discord</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-mono transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a
              href="#community"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold tracking-wide transition-colors"
            >
              Discord
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="overview" className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-800/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Engine & Status Badges */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono mb-8 backdrop-blur-sm">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-400/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              GODOT 4.X ENGINE
            </span>
            <span className="text-slate-400 px-2">OPEN SOURCE TACTICAL RPG</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-400/30">
              COMMUNITY DRIVEN
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto uppercase font-mono">
            Assemble Modular <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400">Robots</span>.
            <br />
            Command Autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-300 to-cyan-400">AI Souls</span>.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-sans">
            AniBots is an open-source tactical RPG blending classic relay-line battlers (inspired by Medabots GBA) with
            autonomous utility AI cores (<span className="text-amber-400 font-semibold">Anima Chips</span>), 5-slot modular chassis engineering,
            and a persistent hardware degradation scrap economy.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contributors"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-sm uppercase tracking-wider hover:shadow-[0_0_24px_rgba(6,182,212,0.5)] transition-all"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2a5 5 0 105 5 5 5 0 00-5-5zm0 12c-4.42 0-8 2.24-8 5v3h16v-3c0-2.76-3.58-5-8-5z" />
              </svg>
              Join As A Contributor
            </a>

            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md border border-cyan-500/40 bg-slate-900/90 text-cyan-300 hover:bg-slate-800/90 hover:border-cyan-400 text-sm font-semibold tracking-wider font-mono transition-all"
            >
              Explore GitHub Code
              <span className="text-xs">↗</span>
            </a>

            <a
              href="#community"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md border border-purple-500/40 bg-purple-950/30 text-purple-300 hover:bg-purple-900/40 text-sm font-semibold tracking-wider font-mono transition-all"
            >
              Discord Server
            </a>
          </div>

          {/* Key Metrics Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800">
            <div className="p-3 rounded bg-slate-900/50 border border-slate-800">
              <div className="text-2xl font-mono font-bold text-cyan-400">38+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-mono">Robot Chassis</div>
            </div>
            <div className="p-3 rounded bg-slate-900/50 border border-slate-800">
              <div className="text-2xl font-mono font-bold text-amber-400">190</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-mono">Modular Parts</div>
            </div>
            <div className="p-3 rounded bg-slate-900/50 border border-slate-800">
              <div className="text-2xl font-mono font-bold text-purple-400">46</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-mono">Anima AI Cores</div>
            </div>
            <div className="p-3 rounded bg-slate-900/50 border border-slate-800">
              <div className="text-2xl font-mono font-bold text-teal-400">3-Phase</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-mono">ATB Relay Loop</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contributor Focus Hub (THE MAIN REQUEST FOCUS) */}
      <section id="contributors" className="py-20 md:py-28 bg-[#090e18] border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-block px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest mb-3">
              We Are Recruiting Contributors
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
              Calling Artists, Animators & Developers
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              AniBots is an ambitious community indie project built in the open. Whether you draw pixel art, model 3D mechas, write GDScript systems, or compose chiptunes, there is a dedicated place for your craft.
            </p>
          </div>

          {/* Interactive Role Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {CONTRIBUTOR_ROLES.map((role) => {
              const isActive = activeTab === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveTab(role.id)}
                  className={`px-4 py-2.5 rounded-md text-xs sm:text-sm font-mono tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_16px_rgba(6,182,212,0.4)]"
                      : "bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {role.title}
                </button>
              );
            })}
          </div>

          {/* Role Detail Showcase Card */}
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row gap-8 items-start justify-between relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    {selectedRole.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Open Opportunities</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-mono">{selectedRole.title}</h3>
                <p className="text-amber-400 text-sm font-mono mt-1 mb-4 font-semibold">{selectedRole.tagline}</p>
                <p className="text-slate-300 text-base leading-relaxed mb-6">{selectedRole.description}</p>

                <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">
                  What We Need from You:
                </h4>
                <ul className="grid sm:grid-cols-2 gap-3 mb-6">
                  {selectedRole.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-200 bg-slate-950/60 p-3 rounded border border-slate-800">
                      <span className="text-cyan-400 font-bold font-mono">›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-xs font-mono text-slate-400 mr-2">Formats & Tools:</span>
                  {selectedRole.techStack.map((tech, idx) => (
                    <span key={idx} className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Box for Selected Role */}
              <div className="w-full lg:w-80 bg-slate-950/90 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Getting Started</div>
                  <div className="text-sm font-semibold text-white mb-3">Ready to contribute to this role?</div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Check current active tasks on our GitHub issue board or join our Discord channel to coordinate directly with developers and lead artists.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <a
                    href={selectedRole.issueLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-colors"
                  >
                    View Role Issues on GitHub
                    <span>↗</span>
                  </a>
                  <a
                    href="#community"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-slate-700 hover:border-slate-600 bg-slate-900 text-slate-300 text-xs font-mono transition-colors"
                  >
                    Chat with Leads on Discord
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Core Systems & 5-Slot Modular Robot Showcase */}
      <section id="modular-system" className="py-20 md:py-28 bg-[#070b12] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
              Deep Modular Mechanics
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
              5-Slot Modular Hardware Anatomy
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              Every AniBot is assembled from 5 swappable components. Handlers must balance loadout weight, cooling rates, and terrain locomotion protocols.
            </p>
          </div>

          {/* Interactive Slot Anatomy Component */}
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Slot Buttons */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {MODULAR_SLOTS.map((slot, index) => {
                const isSelected = activeSlot === index;
                return (
                  <button
                    key={slot.name}
                    onClick={() => setActiveSlot(index)}
                    className={`text-left p-4 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        isSelected ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-300"
                      }`}>
                        0{index + 1}
                      </span>
                      <div>
                        <span className={`block font-mono font-bold text-sm ${isSelected ? "text-white" : "text-slate-300"}`}>
                          {slot.name}
                        </span>
                        <span className="text-xs text-slate-400">{slot.role}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-cyan-400">{slot.tag}</span>
                  </button>
                );
              })}
            </div>

            {/* Slot Detail Card */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-700 rounded-xl p-6 sm:p-8 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div>
                  <span className="text-xs font-mono uppercase text-slate-400">Inspecting Hardware Component</span>
                  <h3 className="text-2xl font-bold font-mono text-white">{MODULAR_SLOTS[activeSlot].name} SLOT</h3>
                </div>
                <span className="px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">
                  {MODULAR_SLOTS[activeSlot].tag}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-mono uppercase text-slate-400 mb-1">Combat Role & Rules</div>
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                    {MODULAR_SLOTS[activeSlot].mechanic}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-xs font-mono uppercase text-cyan-400 mb-1">Key Scaling Attributes</div>
                  <div className="text-sm font-mono text-slate-300">
                    {MODULAR_SLOTS[activeSlot].statFocus}
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
                  <span>• 38 Unique Variants Cataloged</span>
                  <span>• SQLite Schema Persistence</span>
                  <span>• Wear & Tear Condition Scaling</span>
                </div>
              </div>
            </div>
          </div>

          {/* Anima Chip AI Cores Grid */}
          <div className="mt-20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold font-mono text-white">Anima Chips: The Autonomous AI Soul</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl mx-auto">
                Each chip operates on a Weighted Utility AI scoring system to evaluate targets dynamically, equipped with distinct personality engrams and battle haikus.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CHIP_SERIES.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-lg border bg-gradient-to-b ${item.color} backdrop-blur-sm flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider">{item.series}</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40">{item.count}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">{item.summary}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono flex items-center justify-between text-slate-400">
                    <span>Utility AI Targeting</span>
                    <span className="text-white">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contributor Onboarding Pipeline */}
      <section id="onboarding" className="py-20 bg-[#090e18] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-block px-3 py-1 rounded bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono uppercase tracking-widest mb-3">
              Simple 4-Step Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-mono">How to Start Contributing</h2>
            <p className="mt-3 text-slate-400 text-sm">
              We welcome first-time open source contributors as well as seasoned gamedev veterans.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg bg-slate-900/80 border border-slate-800 relative">
              <div className="w-8 h-8 rounded bg-cyan-500 text-slate-950 font-mono font-bold flex items-center justify-center mb-4">1</div>
              <h3 className="font-mono font-bold text-white text-base mb-2">Join Our Discord</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Introduce yourself in <code className="text-cyan-400">#contributions</code>, share your portfolio or past projects, and meet team leads.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-900/80 border border-slate-800 relative">
              <div className="w-8 h-8 rounded bg-cyan-500 text-slate-950 font-mono font-bold flex items-center justify-center mb-4">2</div>
              <h3 className="font-mono font-bold text-white text-base mb-2">Review Design Docs</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Read our modular design specs (<code className="text-cyan-400">PARTS.md</code>, <code className="text-cyan-400">GAME.md</code>, <code className="text-cyan-400">OVERVIEW.md</code>) in the repository.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-900/80 border border-slate-800 relative">
              <div className="w-8 h-8 rounded bg-cyan-500 text-slate-950 font-mono font-bold flex items-center justify-center mb-4">3</div>
              <h3 className="font-mono font-bold text-white text-base mb-2">Claim or Pitch an Issue</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pick a ticket marked <code className="text-cyan-400">good first issue</code> on GitHub or pitch your own robot chassis, sprite, or feature in Discussions.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-900/80 border border-slate-800 relative">
              <div className="w-8 h-8 rounded bg-cyan-500 text-slate-950 font-mono font-bold flex items-center justify-center mb-4">4</div>
              <h3 className="font-mono font-bold text-white text-base mb-2">Submit Pull Request</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fork the repo, test your code or assets in Godot 4, and submit your PR. All human contributors receive full credits in game!
              </p>
            </div>
          </div>

          {/* AI Usage Policy Note */}
          <div className="mt-12 p-5 rounded-lg border border-slate-800 bg-slate-950/60 max-w-3xl mx-auto text-center">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold mb-1">
              AI Tools & Creator Respect Policy
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI tool assistance is permitted to accelerate development. We deeply respect all human artists, animators, and developers: every contributor will be honored and permanently credited in the project databank and credits roll.
            </p>
          </div>
        </div>
      </section>

      {/* Community Hub & Embedded Discord Widget */}
      <section id="community" className="py-20 md:py-28 bg-[#070b12] border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono uppercase tracking-widest mb-3">
              Official Channels
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
              Join Our Community & Hub
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              Coordinate real-time with developers and artists on Discord, participate in feature design in GitHub Discussions, or report bugs and submit code.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Quick Links Column */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-cyan-500/50 transition-all flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono font-bold text-white text-base">GitHub Repository & Code</h3>
                    <span className="text-xs text-cyan-400 font-mono">github.com/c42759/AniBots ↗</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Access Godot project files, GDScript singletons, SQLite database schemas, and documentation.
                  </p>
                </div>
              </a>

              <a
                href={GITHUB_DISCUSSIONS}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-amber-500/50 transition-all flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono font-bold text-white text-base">GitHub Discussions</h3>
                    <span className="text-xs text-amber-400 font-mono">Brainstorming & Ideas ↗</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Pitch new AniBots designs, brainstorm Anima Chip abilities, balance game formulas, and discuss world lore.
                  </p>
                </div>
              </a>

              <a
                href={GITHUB_ISSUES}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-rose-500/50 transition-all flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-slate-950 transition-colors">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono font-bold text-white text-base">Bug Tracker & Open Tasks</h3>
                    <span className="text-xs text-rose-400 font-mono">Issues Board ↗</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Browse active bugs, feature requests, and tasks tagged with <code className="text-rose-300">good first issue</code>.
                  </p>
                </div>
              </a>
            </div>

            {/* Embedded Discord Widget Column */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-900/90 border border-purple-500/30 rounded-xl p-5 shadow-2xl">
              <div className="flex items-center justify-between w-full mb-4 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-mono text-sm font-bold text-purple-300">Live Discord Server</span>
                </div>
                <span className="text-xs font-mono text-slate-400">Join the Chat</span>
              </div>

              {/* Premade User Discord Widget */}
              <div className="w-full flex justify-center overflow-hidden rounded-lg border border-slate-800">
                <iframe
                  src={DISCORD_WIDGET_SRC}
                  width="350"
                  height="500"
                  allowTransparency="true"
                  frameBorder="0"
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                  className="max-w-full"
                  title="AniBots Discord Community"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#05080e] border-t border-slate-800 text-slate-400 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>AniBots Open Source Game Project • Godot 4.x</span>
          </div>

          <div className="flex items-center gap-6">
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              GitHub
            </a>
            <a href={GITHUB_DISCUSSIONS} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              Discussions
            </a>
            <a href={GITHUB_ISSUES} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              Issues
            </a>
            <a href="#community" className="hover:text-cyan-400 transition-colors">
              Discord
            </a>
          </div>

          <div className="text-slate-500">
            MIT Licensed • Built with Next.js & Tailwind CSS
          </div>
        </div>
      </footer>
    </div>
  );
}

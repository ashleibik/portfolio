import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ================================================================
// AHMED SHLEIBIK — PORTFOLIO
// Concept: the visitor is provisioned. Access control and audit
// logs are the design language, because they're the actual
// through-line of the resume (RBAC, provisioning, audit logging).
// ================================================================

const T = {
  paper: "#FAF7F1",
  card: "#FFFFFF",
  ink: "#191817",
  inkSoft: "#6E6A63",
  accent: "#2438E8",
  accentSoft: "#EDEFFE",
  ok: "#0E8A4D",
  line: "#E7E2D9",
  mono: "'IBM Plex Mono', ui-monospace, monospace",
  sans: "'Archivo', system-ui, sans-serif",
};

// ----------------------------------------------------------------
// 3D hero: the page's bento layout as a floating sculpture
// ----------------------------------------------------------------
const BLOCKS = [
  [-2.1, -0.8, 2.6, 1.5],
  [0.9, -1.1, 1.4, 0.9],
  [2.4, -1.1, 1.2, 0.9],
  [-1.4, 1.0, 2.0, 0.9],
  [1.2, 1.0, 1.4, 0.9],
  [2.7, 1.0, 0.8, 0.9],
];

function BentoSculpture() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 3.2, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    const fill = new THREE.MeshBasicMaterial({
      color: new THREE.Color(T.accentSoft),
      transparent: true,
      opacity: 0.55,
    });
    const edgeMat = new THREE.LineBasicMaterial({ color: new THREE.Color(T.accent) });

    const boxes = BLOCKS.map(([x, z, w, d], i) => {
      const geo = new THREE.BoxGeometry(w, 0.35, d);
      const mesh = new THREE.Mesh(geo, fill);
      mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat));
      mesh.position.set(x, 0, z);
      mesh.userData.phase = i * 1.1;
      group.add(mesh);
      return mesh;
    });

    group.rotation.x = 0.12;
    scene.add(group);

    const target = { x: 0.12, y: 0 };
    const onPointer = (e) => {
      const r = mount.getBoundingClientRect();
      target.y = (((e.clientX - r.left) / r.width) * 2 - 1) * 0.35;
      target.x = 0.12 + (((e.clientY - r.top) / r.height) * 2 - 1) * 0.18;
    };
    mount.addEventListener("pointermove", onPointer);

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let raf;
    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      if (!reduced) {
        boxes.forEach((b) => {
          b.position.y = Math.sin(t * 0.9 + b.userData.phase) * 0.09;
        });
      }
      group.rotation.y += (target.y - group.rotation.y) * 0.06;
      group.rotation.x += (target.x - group.rotation.x) * 0.06;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    reduced ? renderer.render(scene, camera) : tick();

    return () => {
      cancelAnimationFrame(raf);
      mount.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      boxes.forEach((b) => b.geometry.dispose());
      fill.dispose();
      edgeMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}

// ----------------------------------------------------------------
// Session bar — the concept, stated in one line at the top
// ----------------------------------------------------------------
function SessionBar() {
  const [time] = useState(() =>
    new Date().toISOString().slice(0, 16).replace("T", " ")
  );
  return (
    <div
      className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl px-4 py-2 text-xs md:col-span-3"
      style={{ background: T.ink, color: T.paper, fontFamily: T.mono }}
    >
      <span className="flex items-center gap-1.5">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: T.ok }}
        />
        access granted
      </span>
      <span style={{ opacity: 0.7 }}>session: visitor@ashleibik</span>
      <span style={{ opacity: 0.7 }}>role: recruiter (read-only)</span>
      <span className="ml-auto" style={{ opacity: 0.5 }}>
        {time} UTC
      </span>
    </div>
  );
}

// ----------------------------------------------------------------
// Shared bits
// ----------------------------------------------------------------
function Card({ title, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl p-6 ${className}`}
      style={{ background: T.card, border: `1px solid ${T.line}` }}
    >
      {title && (
        <h2
          className="mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{ color: T.inkSoft, fontFamily: T.mono }}
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function Tag({ children }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-xs"
      style={{ background: T.accentSoft, color: T.accent, fontFamily: T.mono }}
    >
      {children}
    </span>
  );
}

function LogLine({ stamp, children, tone = "soft" }) {
  return (
    <p className="text-xs leading-relaxed" style={{ fontFamily: T.mono }}>
      <span style={{ color: T.inkSoft }}>{stamp}</span>{" "}
      <span style={{ color: tone === "ok" ? T.ok : T.ink }}>{children}</span>
    </p>
  );
}

// ----------------------------------------------------------------
// Projects
// ----------------------------------------------------------------
const PROJECTS = [
  {
    name: "Resume Tailor AI",
    line: "Hybrid ranking system — TypeScript scores, the LLM only writes.",
    proof: "19/19 unit tests passing · typed Express API",
    stack: ["TypeScript", "React", "Node.js", "Claude API"],
    href: "https://github.com/ashleibik/resume-tailor-ai",
    cta: "source ↗",
  },
  {
    name: "Property Plug",
    line: "Full-stack real-estate app with role-based access control.",
    proof: "live @ property-plug-ebon.vercel.app",
    stack: ["Next.js", "Firebase Auth", "Firestore"],
    href: "https://property-plug-ebon.vercel.app",
    cta: "live app ↗",
  },
  {
    name: "Outlook Automation",
    line: "Unattended pipeline for 100+ emails and attachments monthly.",
    proof: "saves 3+ hrs/week · CSV audit logging",
    stack: ["Python", "pywin32", "Task Scheduler"],
    href: null,
    cta: null,
  },
];

function ProjectRow({ p, last }) {
  const [hover, setHover] = useState(false);
  const Wrapper = p.href ? "a" : "div";
  return (
    <Wrapper
      href={p.href ?? undefined}
      target={p.href ? "_blank" : undefined}
      rel={p.href ? "noreferrer" : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="block"
      style={{
        borderBottom: last ? "none" : `1px solid ${T.line}`,
        textDecoration: "none",
        background: hover ? T.paper : "transparent",
        transition: "background 120ms ease",
        margin: "0 -12px",
        padding: "16px 12px",
        borderRadius: 12,
        cursor: p.href ? "pointer" : "default",
      }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3
          className="text-lg font-semibold"
          style={{ color: hover ? T.accent : T.ink }}
        >
          {p.name}
        </h3>
        {p.cta && (
          <span className="text-xs" style={{ color: T.accent, fontFamily: T.mono }}>
            {p.cta}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm">{p.line}</p>
      <p className="mt-2 text-xs" style={{ color: T.inkSoft, fontFamily: T.mono }}>
        <span style={{ color: T.ok }}>✓</span> {p.proof}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {p.stack.map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
      </div>
    </Wrapper>
  );
}

// ----------------------------------------------------------------
// GitHub activity — live, rendered as log lines
// ----------------------------------------------------------------
function describeEvent(ev) {
  const repo = ev.repo?.name?.replace("ashleibik/", "") ?? "repo";
  switch (ev.type) {
    case "PushEvent": {
      const n = ev.payload?.commits?.length ?? 0;
      return `pushed ${n} commit${n === 1 ? "" : "s"} → ${repo}`;
    }
    case "PullRequestEvent":
      return `${ev.payload?.action} PR → ${repo}`;
    case "CreateEvent":
      return `created ${ev.payload?.ref_type} → ${repo}`;
    case "IssuesEvent":
      return `${ev.payload?.action} issue → ${repo}`;
    case "WatchEvent":
      return `starred ${repo}`;
    default:
      return `${ev.type.replace("Event", "").toLowerCase()} → ${repo}`;
  }
}

function GitHubCard() {
  const [state, setState] = useState({ status: "loading", events: [] });

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("https://api.github.com/users/ashleibik/events/public?per_page=6", {
      signal: ctrl.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error(`GitHub API: ${r.status}`);
        return r.json();
      })
      .then((events) =>
        setState({ status: "done", events: Array.isArray(events) ? events : [] })
      )
      .catch((err) => {
        if (err.name !== "AbortError") setState({ status: "error", events: [] });
      });
    return () => ctrl.abort();
  }, []);

  return (
    <Card title="Activity Log" className="md:col-span-1">
      {state.status === "loading" && (
        <LogLine stamp="....-.. ..">querying github api…</LogLine>
      )}
      {state.status === "error" && (
        <div className="space-y-1">
          <LogLine stamp="warn">live feed unavailable right now</LogLine>
          <a
            href="https://github.com/ashleibik"
            target="_blank"
            rel="noreferrer"
            className="text-xs"
            style={{ color: T.accent, fontFamily: T.mono }}
          >
            view directly on github ↗
          </a>
        </div>
      )}
      {state.status === "done" && state.events.length === 0 && (
        <LogLine stamp="info">no public events this period</LogLine>
      )}
      {state.status === "done" && (
        <div className="space-y-1.5">
          {state.events.map((ev) => (
            <LogLine key={ev.id} stamp={ev.created_at.slice(5, 10)}>
              {describeEvent(ev)}
            </LogLine>
          ))}
        </div>
      )}
      <a
        href="https://github.com/ashleibik"
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-block text-xs"
        style={{ color: T.accent, fontFamily: T.mono }}
      >
        full history → github/ashleibik ↗
      </a>
    </Card>
  );
}

// ----------------------------------------------------------------
// Experience — a typed timeline, so log format carries real info
// ----------------------------------------------------------------
const EXPERIENCE = [
  {
    stamp: "2026-08 → now",
    role: "Software Developer Intern",
    org: "Seyartech (remote)",
    note: "full-stack features on a digital automotive marketplace — spec through deployment, across Dart / TypeScript / C# / Python",
  },
  {
    stamp: "2024-09 → 2026-07",
    role: "Operations Specialist",
    org: "Loblaw Companies",
    note: "access provisioning and permission changes under documented approval — every change logged for audit",
  },
  {
    stamp: "2025-05 → 2027-12",
    role: "Software Development Diploma",
    org: "SAIT, Calgary",
    note: "in progress · CompTIA Security+ targeted Jan 2027 · Google Cybersecurity + AWS Cloud certs complete",
  },
];

function ExperienceCard() {
  return (
    <Card title="Access History" className="md:col-span-2">
      <div className="space-y-4">
        {EXPERIENCE.map((e) => (
          <div key={e.stamp}>
            <p className="text-xs" style={{ color: T.inkSoft, fontFamily: T.mono }}>
              {e.stamp}
            </p>
            <p className="text-sm font-semibold">
              {e.role} <span style={{ color: T.inkSoft }}>· {e.org}</span>
            </p>
            <p className="text-sm" style={{ color: T.inkSoft }}>
              {e.note}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ----------------------------------------------------------------
// Skills as granted scopes
// ----------------------------------------------------------------
const SKILLS = [
  { scope: "languages", items: ["Python", "TypeScript", "C#", "Dart", "SQL"] },
  { scope: "cloud", items: ["Azure", "AWS fundamentals", "Linux"] },
  { scope: "security", items: ["IAM", "RBAC", "least-privilege"] },
];

function SkillsCard() {
  return (
    <Card title="Granted Scopes">
      <div className="space-y-3">
        {SKILLS.map((g) => (
          <div key={g.scope}>
            <p
              className="mb-1 text-xs"
              style={{ color: T.inkSoft, fontFamily: T.mono }}
            >
              {g.scope}:*
            </p>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ----------------------------------------------------------------
// About + contact
// ----------------------------------------------------------------
function AboutCard() {
  return (
    <Card title="About">
      <p className="text-sm leading-relaxed">
        Software development student at SAIT in Calgary. I build practical
        tools that ship — and keep audit logs, because future-me always asks
        what past-me did.
      </p>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: T.inkSoft }}>
        Also: shawarma. Non-negotiable.
      </p>
    </Card>
  );
}

const LINKS = [
  { label: "github/ashleibik", href: "https://github.com/ashleibik" },
  { label: "linkedin/ashleibik", href: "https://linkedin.com/in/ashleibik" },
  { label: "ashleibik@gmail.com", href: "mailto:ashleibik@gmail.com" },
];

function LinksCard() {
  return (
    <Card title="Open a Channel">
      <div className="flex flex-col gap-2">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="rounded-lg px-3 py-2 text-xs"
            style={{
              fontFamily: T.mono,
              color: T.accent,
              background: T.accentSoft,
              textDecoration: "none",
            }}
          >
            {l.label} ↗
          </a>
        ))}
      </div>
    </Card>
  );
}

// ----------------------------------------------------------------
// 403 Runner — an original take on the offline-runner mechanic.
// You are the session cursor; jump the access-denied blocks.
// Game state lives in refs, not useState: the loop runs at 60fps
// and React re-renders would be pure overhead. React owns mount,
// cleanup, and the "phase" the UI cares about; the canvas owns
// every frame in between.
// ----------------------------------------------------------------
function ArcadeCard() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState("idle"); // idle | playing | over
  const phaseRef = useRef("idle");
  const game = useRef(null); // mutable game state, no re-renders

  const setPhaseBoth = (p) => {
    phaseRef.current = p;
    setPhase(p);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const DPR = Math.min(window.devicePixelRatio, 2);
    const W = wrap.clientWidth - 2; // inside the border
    const H = 150;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(DPR, DPR);

    const GROUND = H - 28;
    const reset = () => ({
      y: GROUND,
      vy: 0,
      obstacles: [],
      untilSpawn: 1.0,
      t: 0,
      score: 0,
      best: game.current?.best ?? 0,
    });
    game.current = reset();

    const jump = () => {
      const g = game.current;
      if (phaseRef.current === "playing" && g.y >= GROUND - 0.5) g.vy = -560;
    };

    const start = () => {
      game.current = { ...reset(), best: game.current.best };
      setPhaseBoth("playing");
    };

    const onKey = (e) => {
      if (e.code !== "Space" && e.code !== "ArrowUp") return;
      e.preventDefault(); // keep space from scrolling the page
      phaseRef.current === "playing" ? jump() : start();
    };
    const onTap = () => (phaseRef.current === "playing" ? jump() : start());
    wrap.addEventListener("keydown", onKey);
    wrap.addEventListener("pointerdown", onTap);

    let raf;
    let last = performance.now();

    const draw = () => {
      const g = game.current;
      ctx.clearRect(0, 0, W, H);

      // ground
      ctx.strokeStyle = T.line;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND + 20);
      ctx.lineTo(W, GROUND + 20);
      ctx.stroke();

      // player: the session cursor
      ctx.fillStyle = T.accent;
      ctx.fillRect(36, g.y, 18, 18);

      // obstacles: 403 blocks
      ctx.font = "9px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center";
      g.obstacles.forEach((o) => {
        ctx.fillStyle = "#C43D2F";
        ctx.fillRect(o.x, GROUND + 18 - o.h, o.w, o.h);
        ctx.fillStyle = T.paper;
        ctx.fillText("403", o.x + o.w / 2, GROUND + 18 - o.h / 2 + 3);
      });

      // score, log-style
      ctx.textAlign = "right";
      ctx.fillStyle = T.inkSoft;
      ctx.font = "11px 'IBM Plex Mono', monospace";
      ctx.fillText(
        `uptime: ${String(Math.floor(g.score)).padStart(4, "0")}  best: ${String(
          Math.floor(g.best)
        ).padStart(4, "0")}`,
        W - 12,
        20
      );
    };

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const g = game.current;

      if (phaseRef.current === "playing") {
        g.t += dt;
        g.score += dt * 10;

        // physics
        g.vy += 1700 * dt;
        g.y = Math.min(g.y + g.vy * dt, GROUND);

        // spawn + move obstacles; speed grows with uptime
        const speed = 250 + g.score * 3;
        g.untilSpawn -= dt;
        if (g.untilSpawn <= 0) {
          g.obstacles.push({
            x: W + 20,
            w: 24,
            h: 24 + Math.random() * 18,
          });
          g.untilSpawn = 0.9 + Math.random() * 0.8;
        }
        g.obstacles.forEach((o) => (o.x -= speed * dt));
        g.obstacles = g.obstacles.filter((o) => o.x + o.w > -10);

        // AABB collision, slightly forgiving (4px inset)
        const hit = g.obstacles.some(
          (o) =>
            36 + 14 > o.x + 4 &&
            36 + 4 < o.x + o.w - 4 &&
            g.y + 18 > GROUND + 18 - o.h + 4
        );
        if (hit) {
          g.best = Math.max(g.best, g.score);
          setPhaseBoth("over");
        }
      }

      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("keydown", onKey);
      wrap.removeEventListener("pointerdown", onTap);
    };
  }, []);

  return (
    <Card title="Idle Session Detected" className="md:col-span-3">
      <div
        ref={wrapRef}
        tabIndex={0}
        role="application"
        aria-label="403 Runner mini-game. Space or tap to jump over access-denied blocks."
        className="relative cursor-pointer rounded-xl outline-none"
        style={{ border: `1px solid ${T.line}`, background: T.paper }}
      >
        <canvas ref={canvasRef} className="block" />
        {phase !== "playing" && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-sm font-semibold" style={{ fontFamily: T.mono }}>
              {phase === "over" ? "ACCESS DENIED — session terminated" : "403 RUNNER"}
            </p>
            <p className="text-xs" style={{ color: T.inkSoft, fontFamily: T.mono }}>
              {phase === "over"
                ? "space or tap to reconnect"
                : "space or tap to start · jump the 403s, keep your session alive"}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

// ----------------------------------------------------------------
// Page
// ----------------------------------------------------------------
export default function App() {
  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: T.paper }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');`}</style>

      <div
        className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3"
        style={{ fontFamily: T.sans, color: T.ink }}
      >
        <SessionBar />

        <section
          className="relative overflow-hidden rounded-2xl md:col-span-3"
          style={{ border: `1px solid ${T.line}`, background: T.card, height: 280 }}
        >
          <BentoSculpture />
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-6">
            <h1 className="text-3xl font-bold md:text-4xl">Ahmed Shleibik</h1>
            <p className="text-sm" style={{ color: T.inkSoft, fontFamily: T.mono }}>
              software developer · calgary, ab · tools that ship
            </p>
          </div>
        </section>

        <Card title="Projects" className="md:col-span-2 md:row-span-2">
          {PROJECTS.map((p, i) => (
            <ProjectRow key={p.name} p={p} last={i === PROJECTS.length - 1} />
          ))}
        </Card>

        <AboutCard />
        <GitHubCard />
        <ExperienceCard />
        <SkillsCard />
        <LinksCard />
        <ArcadeCard />

        <footer className="px-2 md:col-span-3">
          <LogLine stamp="log:">
            page rendered · no trackers · react + three.js · session closes when
            you do
          </LogLine>
        </footer>
      </div>
    </div>
  );
}

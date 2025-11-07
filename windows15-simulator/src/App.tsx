import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, JSX } from 'react'
import './App.css'

type AppBlueprint = {
  id: string
  name: string
  description: string
  accent: string
  glyph: string
  component: () => JSX.Element
}

type DesktopWindow = {
  id: string
  appId: string
  position: { x: number; y: number }
  dimensions: { width: number; height: number }
  createdAt: number
}

type QuickAction = {
  id: string
  label: string
  detail: string
  accent: string
}

type TimelineEvent = {
  id: string
  time: string
  title: string
  meta: string
}

type WidgetCard = {
  id: string
  title: string
  status: string
  detail: string
  accent: string
}

type VitalStat = {
  id: string
  label: string
  value: string
  delta: string
  accent: string
}

type WindowDescriptor = DesktopWindow & {
  blueprint: AppBlueprint
  zIndex: number
}

type GlyphSize = 'lg' | 'sm'

const WINDOW_ANCHORS = [
  { x: 7, y: 12, width: 36, height: 38 },
  { x: 28, y: 18, width: 36, height: 36 },
  { x: 49, y: 10, width: 36, height: 40 },
  { x: 16, y: 40, width: 34, height: 32 }
]

const INITIAL_WINDOW_IDS = ['lumina-canvas', 'flux-mail']

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'focus-mode',
    label: 'Launch focus session',
    detail: 'Ninety minutes of adaptive ambient scoring',
    accent: '#7b7dff'
  },
  {
    id: 'holo-share',
    label: 'Project to HoloWall',
    detail: 'Cast Lumina Canvas to the war room display',
    accent: '#5aa4ff'
  },
  {
    id: 'summon-copilot',
    label: 'Open Quantum Copilot',
    detail: 'Ask anything about this workspace memory',
    accent: '#4dd4b0'
  },
  {
    id: 'timeline',
    label: 'Review temporal trace',
    detail: 'See today highlights in a single stream',
    accent: '#ff8f5c'
  }
]

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'sync',
    time: '09:30',
    title: 'Neural architecture sync',
    meta: 'Horizon campus hybrid room'
  },
  {
    id: 'deploy',
    time: '12:00',
    title: 'Deploy Aurora transit build',
    meta: 'Auto release channel at sixty seven percent readiness'
  },
  {
    id: 'review',
    time: '15:45',
    title: 'Experience review with council',
    meta: 'Immersive mode staging theatre'
  }
]

const WIDGET_CARDS: WidgetCard[] = [
  {
    id: 'weather',
    title: 'Weather - Neo San Francisco',
    status: 'Eighteen deg coastal clarity',
    detail: 'Zephyr winds and visibility ninety eight percent',
    accent: '#6fa4ff'
  },
  {
    id: 'focus',
    title: 'Next focus block',
    status: 'Deep design sprint',
    detail: 'Fourteen thirty to sixteen with Nova team',
    accent: '#b57dff'
  },
  {
    id: 'environment',
    title: 'Workspace atmosphere',
    status: 'Zenwave profile active',
    detail: 'Airflow twenty three deg and light set to three eighty lumens',
    accent: '#4dd4b0'
  }
]

const VITAL_STATS: VitalStat[] = [
  {
    id: 'cpu',
    label: 'Neural cores',
    value: '32%',
    delta: 'Stable draw',
    accent: '#6fa4ff'
  },
  {
    id: 'gpu',
    label: 'Photon matrix',
    value: '68%',
    delta: 'Rendering pass',
    accent: '#ff8f5c'
  },
  {
    id: 'memory',
    label: 'Memory weave',
    value: '42%',
    delta: 'Self balancing',
    accent: '#4dd4b0'
  }
]

const FOCUS_METRICS: VitalStat[] = [
  {
    id: 'flow',
    label: 'Flow score',
    value: '87',
    delta: '+6 today',
    accent: '#b57dff'
  },
  {
    id: 'streak',
    label: 'Focus streak',
    value: '4d',
    delta: 'Maintained',
    accent: '#6fa4ff'
  }
]

const pinnedAppIds = [
  'lumina-canvas',
  'flux-mail',
  'chronos-board',
  'synapse-studio'
]

const recommendedAppIds = [
  'pulse-analytics',
  'quantum-vault',
  'horizon-browser'
]

const FLUX_THREADS = [
  {
    id: 'council',
    title: 'Nova council',
    preview:
      'Council aligned on horizon narrative. Need final sensory specs by tonight.',
    tag: 'Priority',
    time: '08:42',
    initials: 'NC',
    accent: '#6fa4ff'
  },
  {
    id: 'aurora',
    title: 'Aurora operations',
    preview:
      'Transit build deployed to simulation tier. Review routing data before go live.',
    tag: 'Action',
    time: '09:18',
    initials: 'AO',
    accent: '#4dd4b0'
  },
  {
    id: 'field',
    title: 'Field experience',
    preview:
      'Immersion pods report peak satisfaction. Request curated clips for briefing.',
    tag: 'Highlights',
    time: '10:02',
    initials: 'FE',
    accent: '#b57dff'
  },
  {
    id: 'logistics',
    title: 'Logistics mesh',
    preview:
      'Updated passenger flow models available. Copilot can blend with live telemetry.',
    tag: 'Update',
    time: '10:48',
    initials: 'LM',
    accent: '#ff8f5c'
  }
]

const CHRONOS_STREAM = [
  {
    id: 'prototype',
    label: 'Prototype sprint',
    detail: 'Lumina Canvas handoff to Aurora runtime for ambient lighting.',
    status: 'In review',
    accent: '#b57dff'
  },
  {
    id: 'testing',
    label: 'Field testing',
    detail: 'Crowdflow simulation with live participants in sector five.',
    status: 'Live',
    accent: '#4dd4b0'
  },
  {
    id: 'handoff',
    label: 'Council preview',
    detail: 'Executive walk through scheduled for eighteen hundred.',
    status: 'Preparing',
    accent: '#6fa4ff'
  }
]

const SYNAPSE_CLUSTERS = [
  {
    id: 'sense',
    title: 'Sensory loop',
    detail: 'Adaptive lighting nodes syncing every two seconds.'
  },
  {
    id: 'motion',
    title: 'Motion feed',
    detail: 'Crowdflow anchors locked. Drift under one percent.'
  },
  {
    id: 'ambient',
    title: 'Ambient mix',
    detail: 'Soundscape balanced for four hundred active listeners.'
  }
]

const QUANTUM_VAULT_ITEMS = [
  {
    id: 'render',
    title: 'Aurora render stack',
    detail: 'Twelve holographic passes stored with integrity seal.',
    status: 'Synced 3 minutes ago'
  },
  {
    id: 'docs',
    title: 'Experience briefing',
    detail: 'Narrative deck with council annotations.',
    status: 'Shared with four leads'
  },
  {
    id: 'schema',
    title: 'Transit data schema',
    detail: 'Encrypted blueprint for routing intelligence.',
    status: 'Key rotation in progress'
  }
]

const PULSE_METRICS = [
  {
    id: 'satisfaction',
    label: 'Experience rating',
    value: '4.8',
    delta: '+0.3 today'
  },
  {
    id: 'dwell',
    label: 'Average dwell',
    value: '21m',
    delta: 'Up 2m'
  },
  {
    id: 'energy',
    label: 'Energy load',
    value: '63%',
    delta: 'Balanced'
  }
]

const HORIZON_TABS = [
  {
    id: 'aurora',
    title: 'Aurora transit design file',
    status: 'Live in Lumina Canvas'
  },
  {
    id: 'sensor',
    title: 'Sensor telemetry dashboard',
    status: 'Pinned for quick review'
  },
  {
    id: 'brief',
    title: 'Council briefing outline',
    status: 'Ready for rehearsal'
  }
]

function LuminaCanvasContent() {
  return (
    <div className="window-body lumina">
      <section className="window-section split">
        <div className="window-card holo">
          <header className="card-head">
            <span className="chip soft">Aurora transit hub</span>
            <span className="meta">Neural iteration twelve B</span>
          </header>
          <div className="holo-visual">
            <div className="holo-core">
              <span className="meta">Atmosphere layers</span>
              <strong>Adaptive skylight mesh</strong>
            </div>
            <div className="holo-wave">
              <span />
              <span />
              <span />
            </div>
          </div>
          <footer className="card-foot">
            <span className="meta">Restore previous</span>
            <span className="meta">Share scene</span>
          </footer>
        </div>
        <div className="window-column">
          <article className="window-card insight">
            <header className="card-head">
              <span className="chip">Comfort index</span>
              <span className="meta accent">97%</span>
            </header>
            <p>
              Daylight calibration aligned to circadian rhythm clusters across
              concourse flow.
            </p>
            <footer className="card-foot">
              <span className="meta">Adaptive shading</span>
              <span className="meta">Ambient score plus twelve</span>
            </footer>
          </article>
          <article className="window-card insight accent">
            <header className="card-head">
              <span className="chip">Experience pulse</span>
              <span className="meta accent">4.9</span>
            </header>
            <p>
              Sensory feedback from user cohort indicates resonance with horizon
              palette.
            </p>
            <footer className="card-foot">
              <span className="meta">One hundred sixty nine samples</span>
              <span className="meta">Realtime</span>
            </footer>
          </article>
        </div>
      </section>
      <section className="window-section footer">
        <div className="chip-row">
          <span className="chip hollow">Immersive transit</span>
          <span className="chip hollow">Responsive lighting</span>
          <span className="chip hollow">Crowdflow AI</span>
        </div>
        <div className="progress-grid">
          <div>
            <span className="meta">Render pipeline</span>
            <div className="progress-track">
              <span style={{ width: '78%' }} />
            </div>
          </div>
          <div className="progress-metrics">
            <strong>02:36</strong>
            <span className="meta">Remaining</span>
          </div>
        </div>
      </section>
    </div>
  )
}

function FluxMailContent() {
  return (
    <div className="window-body flux">
      <section className="window-section header">
        <div>
          <h3 className="section-title">Priority mesh</h3>
          <p className="meta">Smart triage curated by Copilot</p>
        </div>
        <div className="addons">
          <span className="ghost">Focus bubble - 42m left</span>
          <span className="ghost">New hologram</span>
        </div>
      </section>
      <section className="window-section mail-list">
        {FLUX_THREADS.map((thread) => (
          <article key={thread.id} className="mail-card">
            <div className="mail-primary">
              <span
                className="avatar"
                style={{ background: thread.accent } as CSSProperties}
              >
                {thread.initials}
              </span>
              <div>
                <strong>{thread.title}</strong>
                <p>{thread.preview}</p>
              </div>
            </div>
            <div className="mail-meta">
              <span className="tag">{thread.tag}</span>
              <span className="meta">{thread.time}</span>
            </div>
          </article>
        ))}
      </section>
      <section className="window-section footer grid">
        <div className="stat-capsule">
          <strong>12</strong>
          <span className="meta">Awaiting sentiment</span>
        </div>
        <div className="stat-capsule accent">
          <strong>4</strong>
          <span className="meta">Delegated to Copilot</span>
        </div>
        <div className="stat-capsule">
          <strong>32</strong>
          <span className="meta">Cleared today</span>
        </div>
      </section>
    </div>
  )
}

function ChronosBoardContent() {
  return (
    <div className="window-body chronos">
      <section className="window-section timeline">
        {CHRONOS_STREAM.map((item) => (
          <article key={item.id} className="timeline-card">
            <header className="card-head">
              <span className="chip">{item.label}</span>
              <span className="meta accent">{item.status}</span>
            </header>
            <p>{item.detail}</p>
          </article>
        ))}
      </section>
      <section className="window-section split">
        <article className="window-card neutral">
          <h3 className="section-title">Focus velocity</h3>
          <div className="sparkline">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <p className="meta">Flow maintained across four day streak.</p>
        </article>
        <article className="window-card neutral">
          <h3 className="section-title">Next milestone</h3>
          <p>Immersive council review scheduled in eighteen hours.</p>
          <div className="chip-row">
            <span className="chip hollow">Prepare narrative</span>
            <span className="chip hollow">Sync data room</span>
          </div>
        </article>
      </section>
    </div>
  )
}

function SynapseStudioContent() {
  return (
    <div className="window-body synapse">
      <section className="window-section split">
        <article className="window-card neutral">
          <header className="card-head">
            <span className="chip">Neural build</span>
            <span className="meta accent">Live</span>
          </header>
          <ul className="stack-list">
            {SYNAPSE_CLUSTERS.map((cluster) => (
              <li key={cluster.id}>
                <strong>{cluster.title}</strong>
                <p>{cluster.detail}</p>
              </li>
            ))}
          </ul>
        </article>
        <article className="window-card neutral">
          <header className="card-head">
            <span className="chip">Signal</span>
            <span className="meta">Latency fourteen ms</span>
          </header>
          <div className="signal-wave">
            <span />
            <span />
            <span />
            <span />
          </div>
          <p className="meta">Synapse net stable with minimal drift.</p>
        </article>
      </section>
      <section className="window-section footer">
        <div className="chip-row">
          <span className="chip hollow">Version 7.3</span>
          <span className="chip hollow">Reliability 99.6%</span>
          <span className="chip hollow">Coverage full campus</span>
        </div>
      </section>
    </div>
  )
}

function QuantumVaultContent() {
  return (
    <div className="window-body simple">
      <section className="window-section header">
        <h3 className="section-title">Secure artifacts</h3>
        <p className="meta">Quantum locked across three regions.</p>
      </section>
      <section className="window-section list">
        {QUANTUM_VAULT_ITEMS.map((item) => (
          <article key={item.id} className="vault-card">
            <strong>{item.title}</strong>
            <p>{item.detail}</p>
            <span className="meta">{item.status}</span>
          </article>
        ))}
      </section>
    </div>
  )
}

function PulseAnalyticsContent() {
  return (
    <div className="window-body pulse">
      <section className="window-section header">
        <h3 className="section-title">Experience analytics</h3>
        <p className="meta">Realtime signal from twelve thousand sensors.</p>
      </section>
      <section className="window-section split">
        <div className="window-card neutral">
          <div className="metric-grid">
            {PULSE_METRICS.map((metric) => (
              <div key={metric.id} className="metric-card">
                <span className="meta">{metric.label}</span>
                <strong>{metric.value}</strong>
                <span className="meta">{metric.delta}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="window-card neutral">
          <h4 className="section-title">Crowd flow</h4>
          <div className="sparkline tall">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <p className="meta">
            Peak expected at eighteen twenty. Adaptive routing already staged.
          </p>
        </div>
      </section>
    </div>
  )
}

function HorizonBrowserContent() {
  return (
    <div className="window-body simple">
      <section className="window-section header">
        <h3 className="section-title">Horizon browser</h3>
        <p className="meta">Pinned workspaces ready for action.</p>
      </section>
      <section className="window-section list">
        {HORIZON_TABS.map((tab) => (
          <article key={tab.id} className="tab-card">
            <strong>{tab.title}</strong>
            <span className="meta">{tab.status}</span>
          </article>
        ))}
      </section>
    </div>
  )
}

const APP_BLUEPRINTS: AppBlueprint[] = [
  {
    id: 'lumina-canvas',
    name: 'Lumina Canvas',
    description: 'Design immersive spaces with neural tooling.',
    accent: '#6f93ff',
    glyph: 'LC',
    component: LuminaCanvasContent
  },
  {
    id: 'flux-mail',
    name: 'Flux Mail',
    description: 'Priority communications with Copilot triage.',
    accent: '#b57dff',
    glyph: 'FM',
    component: FluxMailContent
  },
  {
    id: 'chronos-board',
    name: 'Chronos Board',
    description: 'Timeline intelligence and focus metrics.',
    accent: '#4dd4b0',
    glyph: 'CB',
    component: ChronosBoardContent
  },
  {
    id: 'synapse-studio',
    name: 'Synapse Studio',
    description: 'Control the ambient neural network.',
    accent: '#5aa4ff',
    glyph: 'SS',
    component: SynapseStudioContent
  },
  {
    id: 'quantum-vault',
    name: 'Quantum Vault',
    description: 'Secure artifacts with zero trust locking.',
    accent: '#ff8f5c',
    glyph: 'QV',
    component: QuantumVaultContent
  },
  {
    id: 'pulse-analytics',
    name: 'Pulse Analytics',
    description: 'Experience telemetry and live feedback.',
    accent: '#ffd166',
    glyph: 'PA',
    component: PulseAnalyticsContent
  },
  {
    id: 'horizon-browser',
    name: 'Horizon Browser',
    description: 'Jump back into connected workspaces.',
    accent: '#64d2ff',
    glyph: 'HB',
    component: HorizonBrowserContent
  }
]

function buildWindow(appId: string, order: number): DesktopWindow {
  const anchor = WINDOW_ANCHORS[order % WINDOW_ANCHORS.length]
  const timestamp = Date.now() + order
  const suffix = Math.floor(Math.random() * 1000)
  return {
    id: `${appId}-${timestamp}-${suffix}`,
    appId,
    position: { x: anchor.x, y: anchor.y },
    dimensions: { width: anchor.width, height: anchor.height },
    createdAt: timestamp
  }
}

function App() {
  const appIndex = useMemo(() => {
    const map = new Map<string, AppBlueprint>()
    for (const app of APP_BLUEPRINTS) {
      map.set(app.id, app)
    }
    return map
  }, [])

  const [startOpen, setStartOpen] = useState(false)
  const [widgetsOpen, setWidgetsOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date())
    }, 30000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setStartOpen(false)
        setWidgetsOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const initialWindows = useMemo(
    () =>
      INITIAL_WINDOW_IDS.filter((id) => appIndex.has(id)).map((id, index) =>
        buildWindow(id, index)
      ),
    [appIndex]
  )

  const [openWindows, setOpenWindows] = useState<DesktopWindow[]>(initialWindows)
  const [activeWindowId, setActiveWindowId] = useState<string | null>(
    initialWindows.length
      ? initialWindows[initialWindows.length - 1].id
      : null
  )

  useEffect(() => {
    if (!activeWindowId && openWindows.length) {
      setActiveWindowId(openWindows[openWindows.length - 1].id)
    }
  }, [openWindows, activeWindowId])

  const windowsWithBlueprint: WindowDescriptor[] = openWindows
    .map((window, index) => {
      const blueprint = appIndex.get(window.appId)
      if (!blueprint) {
        return null
      }
      return {
        ...window,
        blueprint,
        zIndex: 24 + index * 2
      }
    })
    .filter((value): value is WindowDescriptor => value !== null)

  const pinnedBlueprints = useMemo(
    () =>
      pinnedAppIds
        .map((id) => appIndex.get(id))
        .filter((value): value is AppBlueprint => Boolean(value)),
    [appIndex]
  )

  const recommendedBlueprints = useMemo(
    () =>
      recommendedAppIds
        .map((id) => appIndex.get(id))
        .filter((value): value is AppBlueprint => Boolean(value)),
    [appIndex]
  )

  const closeOverlays = () => {
    setStartOpen(false)
    setWidgetsOpen(false)
  }

  const handleLaunchApp = (appId: string) => {
    if (!appIndex.has(appId)) {
      return
    }
    setOpenWindows((prev) => {
      const existing = prev.find((window) => window.appId === appId)
      if (existing) {
        const refreshed: DesktopWindow = {
          ...existing,
          createdAt: Date.now()
        }
        setActiveWindowId(refreshed.id)
        return [
          ...prev.filter((window) => window.id !== existing.id),
          refreshed
        ]
      }
      const created = buildWindow(appId, prev.length)
      setActiveWindowId(created.id)
      return [...prev, created]
    })
    setStartOpen(false)
    setWidgetsOpen(false)
  }

  const handleFocusWindow = (windowId: string) => {
    setOpenWindows((prev) => {
      const target = prev.find((window) => window.id === windowId)
      if (!target) {
        return prev
      }
      const refreshed: DesktopWindow = {
        ...target,
        createdAt: Date.now()
      }
      return [
        ...prev.filter((window) => window.id !== windowId),
        refreshed
      ]
    })
    setActiveWindowId(windowId)
    setStartOpen(false)
  }

  const handleCloseWindow = (windowId: string) => {
    setOpenWindows((prev) => {
      const filtered = prev.filter((window) => window.id !== windowId)
      setActiveWindowId((current) =>
        current === windowId
          ? filtered.length
            ? filtered[filtered.length - 1].id
            : null
          : current
      )
      return filtered
    })
  }

  const overlayVisible = startOpen
  const timeString = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  const dateString = currentTime.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className="future-shell">
      <div className="ambient">
        <div className="ambient-gradient" />
        <div className="ambient-mesh" />
        <div className="ambient-glow one" />
        <div className="ambient-glow two" />
      </div>

      <div
        className="desktop-layer"
        onMouseDown={() => {
          if (startOpen) {
            setStartOpen(false)
          }
        }}
      >
        <div className="desktop-fabric" />
        <div className="desktop-gridlines" />
        <div className="window-tray">
          {windowsWithBlueprint.map((descriptor) => (
            <AppWindow
              key={descriptor.id}
              descriptor={descriptor}
              isActive={activeWindowId === descriptor.id}
              onClose={handleCloseWindow}
              onFocus={handleFocusWindow}
            />
          ))}
        </div>
      </div>

      <WidgetPanel
        open={widgetsOpen}
        widgets={WIDGET_CARDS}
        vitals={VITAL_STATS}
        focusMetrics={FOCUS_METRICS}
      />

      {overlayVisible ? (
        <div
          className="interaction-overlay"
          onMouseDown={(event) => {
            event.stopPropagation()
            closeOverlays()
          }}
        />
      ) : null}

      <StartMenu
        open={startOpen}
        pinned={pinnedBlueprints}
        recommended={recommendedBlueprints}
        quickActions={QUICK_ACTIONS}
        timeline={TIMELINE_EVENTS}
        onLaunch={handleLaunchApp}
      />

      <Taskbar
        startOpen={startOpen}
        widgetsOpen={widgetsOpen}
        pinned={pinnedBlueprints}
        openWindows={windowsWithBlueprint}
        activeWindowId={activeWindowId}
        timeString={timeString}
        dateString={dateString}
        onToggleStart={() => {
          setStartOpen((prev) => !prev)
          setWidgetsOpen(false)
        }}
        onToggleWidgets={() => {
          setWidgetsOpen((prev) => !prev)
          setStartOpen(false)
        }}
        onLaunchApp={handleLaunchApp}
        onFocusWindow={handleFocusWindow}
      />
    </div>
  )
}

type TaskbarProps = {
  startOpen: boolean
  widgetsOpen: boolean
  pinned: AppBlueprint[]
  openWindows: WindowDescriptor[]
  activeWindowId: string | null
  timeString: string
  dateString: string
  onToggleStart: () => void
  onToggleWidgets: () => void
  onLaunchApp: (appId: string) => void
  onFocusWindow: (windowId: string) => void
}

function Taskbar({
  startOpen,
  widgetsOpen,
  pinned,
  openWindows,
  activeWindowId,
  timeString,
  dateString,
  onToggleStart,
  onToggleWidgets,
  onLaunchApp,
  onFocusWindow
}: TaskbarProps) {
  return (
    <nav
      className="taskbar"
      onMouseDown={(event) => {
        event.stopPropagation()
      }}
    >
      <div className="taskbar-left">
        <button
          type="button"
          className={`taskbar-pill ${startOpen ? 'active' : ''}`}
          onClick={onToggleStart}
        >
          <span className="start-symbol">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span>Start</span>
        </button>
        <button
          type="button"
          className={`taskbar-pill ${widgetsOpen ? 'active' : ''}`}
          onClick={onToggleWidgets}
        >
          Widgets
        </button>
      </div>
      <div className="taskbar-center">
        {pinned.map((app) => (
          <button
            type="button"
            key={app.id}
            className="taskbar-icon"
            onClick={() => onLaunchApp(app.id)}
            title={app.name}
          >
            <GlyphIcon glyph={app.glyph} accent={app.accent} size="lg" />
          </button>
        ))}
      </div>
      <div className="taskbar-right">
        <div className="taskbar-open">
          {openWindows.map((window) => (
            <button
              type="button"
              key={window.id}
              className={`open-chip ${
                activeWindowId === window.id ? 'active' : ''
              }`}
              onClick={() => onFocusWindow(window.id)}
            >
              <span
                className="dot"
                style={{ background: window.blueprint.accent } as CSSProperties}
              />
              <span>{window.blueprint.name}</span>
            </button>
          ))}
        </div>
        <div className="taskbar-clock">
          <strong>{timeString}</strong>
          <span className="meta">{dateString}</span>
        </div>
      </div>
    </nav>
  )
}

type StartMenuProps = {
  open: boolean
  pinned: AppBlueprint[]
  recommended: AppBlueprint[]
  quickActions: QuickAction[]
  timeline: TimelineEvent[]
  onLaunch: (appId: string) => void
}

function StartMenu({
  open,
  pinned,
  recommended,
  quickActions,
  timeline,
  onLaunch
}: StartMenuProps) {
  return (
    <section
      className={`start-menu ${open ? 'open' : ''}`}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className="start-inner">
        <header className="start-header">
          <h2>Windows 15 Vision</h2>
          <span className="meta">Design build - quantum workspace</span>
        </header>
        <div className="start-search">
          <span>Ask Copilot or search everything</span>
          <span className="shortcut">Ctrl + Space</span>
        </div>
        <div className="start-hero">
          <article className="copilot-card">
            <span className="chip soft">Copilot</span>
            <h3>Need a summary of Lumina Canvas?</h3>
            <p className="meta">
              Copilot knows every iteration and context ready for the council.
            </p>
            <button type="button">Start a prompt</button>
          </article>
          <div className="quick-actions">
            {quickActions.map((action) => (
              <button type="button" key={action.id} className="quick-card">
                <span
                  className="chip soft"
                  style={{ color: action.accent } as CSSProperties}
                >
                  {action.label}
                </span>
                <span className="meta">{action.detail}</span>
              </button>
            ))}
          </div>
        </div>
        <section className="start-section">
          <header>
            <h3>Pinned</h3>
            <span className="meta">Quick launch</span>
          </header>
          <div className="pinned-grid">
            {pinned.map((app) => (
              <button
                type="button"
                key={app.id}
                className="pinned-item"
                onClick={() => onLaunch(app.id)}
              >
                <GlyphIcon glyph={app.glyph} accent={app.accent} size="lg" />
                <span>{app.name}</span>
              </button>
            ))}
          </div>
        </section>
        <section className="start-section">
          <header>
            <h3>Recommended</h3>
            <span className="meta">Based on recent activity</span>
          </header>
          <ul className="recommended-list">
            {recommended.map((app) => (
              <li key={app.id}>
                <button
                  type="button"
                  className="recommended-card"
                  onClick={() => onLaunch(app.id)}
                >
                  <GlyphIcon glyph={app.glyph} accent={app.accent} size="sm" />
                  <div>
                    <strong>{app.name}</strong>
                    <span className="meta">{app.description}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section className="start-section">
          <header>
            <h3>Today</h3>
            <span className="meta">Timeline</span>
          </header>
          <ul className="timeline-list">
            {timeline.map((entry) => (
              <li key={entry.id} className="timeline-entry">
                <span className="time">{entry.time}</span>
                <div>
                  <strong>{entry.title}</strong>
                  <span className="meta">{entry.meta}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  )
}

type WidgetPanelProps = {
  open: boolean
  widgets: WidgetCard[]
  vitals: VitalStat[]
  focusMetrics: VitalStat[]
}

function WidgetPanel({
  open,
  widgets,
  vitals,
  focusMetrics
}: WidgetPanelProps) {
  return (
    <aside
      className={`widget-panel ${open ? 'open' : ''}`}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <header className="widget-header">
        <span className="meta">Dashboard</span>
        <strong>Glance</strong>
      </header>
      <div className="widget-grid">
        {widgets.map((widget) => (
          <article key={widget.id} className="widget-card">
            <span
              className="chip soft"
              style={{ color: widget.accent } as CSSProperties}
            >
              {widget.title}
            </span>
            <strong>{widget.status}</strong>
            <p className="meta">{widget.detail}</p>
          </article>
        ))}
      </div>
      <div className="widget-vitals">
        {vitals.map((stat) => (
          <div key={stat.id} className="vital-card">
            <span className="meta">{stat.label}</span>
            <strong style={{ color: stat.accent } as CSSProperties}>
              {stat.value}
            </strong>
            <span className="meta">{stat.delta}</span>
          </div>
        ))}
      </div>
      <div className="widget-focus">
        {focusMetrics.map((metric) => (
          <div key={metric.id} className="focus-card">
            <span className="meta">{metric.label}</span>
            <strong style={{ color: metric.accent } as CSSProperties}>
              {metric.value}
            </strong>
            <span className="meta">{metric.delta}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}

type AppWindowProps = {
  descriptor: WindowDescriptor
  isActive: boolean
  onClose: (windowId: string) => void
  onFocus: (windowId: string) => void
}

function AppWindow({
  descriptor,
  isActive,
  onClose,
  onFocus
}: AppWindowProps) {
  const { id, blueprint, position, dimensions, zIndex } = descriptor
  const Content = blueprint.component
  const style: CSSProperties = {
    left: `${position.x}%`,
    top: `${position.y}%`,
    width: `${dimensions.width}vw`,
    height: `${dimensions.height}vh`,
    zIndex
  }

  return (
    <div
      className={`desktop-window ${isActive ? 'active' : ''}`}
      style={style}
      onMouseDown={(event) => {
        event.stopPropagation()
        onFocus(id)
      }}
    >
      <header className="title-bar">
        <div className="title-left">
          <GlyphIcon glyph={blueprint.glyph} accent={blueprint.accent} />
          <div className="title-text">
            <span className="title-name">{blueprint.name}</span>
            <span className="meta">{blueprint.description}</span>
          </div>
        </div>
        <div className="title-actions">
          <button type="button" className="ghost" aria-label="Minimize">
            _
          </button>
          <button type="button" className="ghost" aria-label="Maximize">
            []
          </button>
          <button
            type="button"
            className="ghost close"
            aria-label="Close"
            onClick={(event) => {
              event.stopPropagation()
              onClose(id)
            }}
          >
            x
          </button>
        </div>
      </header>
      <Content />
    </div>
  )
}

type GlyphIconProps = {
  glyph: string
  accent: string
  size?: GlyphSize
}

function GlyphIcon({ glyph, accent, size = 'lg' }: GlyphIconProps) {
  return (
    <span
      className={`glyph-icon ${size}`}
      style={{ '--accent-color': accent } as CSSProperties}
    >
      {glyph}
    </span>
  )
}

export default App

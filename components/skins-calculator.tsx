"use client"

import { useMemo, useState } from "react"
import { Flag, Plus, Trash2, DollarSign, RotateCcw, Trophy, ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { calculateSkins, type Player } from "@/lib/skins"
import { Scorecard } from "@/components/scorecard"
import { ResultsPanel } from "@/components/results-panel"

let idCounter = 0
function newId() {
  idCounter += 1
  return `p${idCounter}-${Math.random().toString(36).slice(2, 7)}`
}

function makePlayer(name: string, holes: number): Player {
  return { id: newId(), name, scores: Array(holes).fill(null) }
}

const DEFAULT_HOLES = 18

export function SkinsCalculator() {
  const [holes, setHoles] = useState<9 | 18>(DEFAULT_HOLES)
  const [pot, setPot] = useState<string>("100")
  const [carryOver, setCarryOver] = useState<boolean>(true)
  const [players, setPlayers] = useState<Player[]>(() => [
    makePlayer("Player 1", DEFAULT_HOLES),
    makePlayer("Player 2", DEFAULT_HOLES),
  ])

  const potNumber = useMemo(() => {
    const n = Number.parseFloat(pot)
    return Number.isFinite(n) && n > 0 ? n : 0
  }, [pot])

  const result = useMemo(
    () => calculateSkins(players, holes, potNumber, carryOver),
    [players, holes, potNumber, carryOver],
  )

  function setHoleCount(count: 9 | 18) {
    setHoles(count)
    setPlayers((prev) =>
      prev.map((p) => {
        const scores = p.scores.slice(0, count)
        while (scores.length < count) scores.push(null)
        return { ...p, scores }
      }),
    )
  }

  function addPlayer() {
    setPlayers((prev) => [...prev, makePlayer(`Player ${prev.length + 1}`, holes)])
  }

  function removePlayer(id: string) {
    setPlayers((prev) => (prev.length > 2 ? prev.filter((p) => p.id !== id) : prev))
  }

  function renamePlayer(id: string, name: string) {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)))
  }

  function setScore(id: string, holeIndex: number, value: number | null) {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const scores = p.scores.slice()
        scores[holeIndex] = value
        return { ...p, scores }
      }),
    )
  }

  function resetScores() {
    setPlayers((prev) => prev.map((p) => ({ ...p, scores: Array(holes).fill(null) })))
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:py-12">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-primary">
          <Flag className="size-6" aria-hidden="true" />
          <span className="text-sm font-semibold uppercase tracking-widest">Golf</span>
        </div>
        <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
          Skins Game Calculator
        </h1>
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Enter your players, choose the number of holes, and set the total pot. The lowest
          score wins the skin on each hole. Ties push the skin forward to the next hole.
        </p>
      </header>

      {/* Setup controls */}
      <section
        aria-label="Game setup"
        className="grid gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm md:grid-cols-2 md:p-6"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Number of holes</label>
          <div className="flex gap-2">
            {([9, 18] as const).map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setHoleCount(count)}
                aria-pressed={holes === count}
                className={
                  "flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors " +
                  (holes === count
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-accent")
                }
              >
                {count} Holes
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Carry overs</label>
          <button
            type="button"
            role="switch"
            aria-checked={carryOver}
            onClick={() => setCarryOver((prev) => !prev)}
            className={
              "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors " +
              (carryOver
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-accent")
            }
          >
            <ArrowRightLeft className="size-4" aria-hidden="true" />
            {carryOver ? "Carry overs on" : "Carry overs off"}
          </button>
          <p className="text-xs text-muted-foreground">
            {carryOver
              ? "Tied holes push the skin forward to the next hole"
              : "Tied holes are voided — skin is not awarded"}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="pot" className="text-sm font-medium">
            Total pot
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
            <DollarSign className="size-4 text-muted-foreground" aria-hidden="true" />
            <input
              id="pot"
              inputMode="decimal"
              value={pot}
              onChange={(e) => setPot(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="100"
              className="w-full bg-transparent py-2.5 text-sm outline-none"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {potNumber > 0
              ? `$${(potNumber / holes).toFixed(2)} per hole across ${holes} holes`
              : "Enter an amount to split across the holes"}
          </p>
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Players ({players.length})</label>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={resetScores}>
                <RotateCcw className="size-4" aria-hidden="true" />
                Reset scores
              </Button>
              <Button type="button" size="sm" onClick={addPlayer}>
                <Plus className="size-4" aria-hidden="true" />
                Add player
              </Button>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {players.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5"
              >
                <span
                  className="grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold"
                  style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
                >
                  {i + 1}
                </span>
                <input
                  aria-label={`Name for player ${i + 1}`}
                  value={p.name}
                  onChange={(e) => renamePlayer(p.id, e.target.value)}
                  className="w-full bg-transparent py-1 text-sm outline-none"
                />
                <button
                  type="button"
                  aria-label={`Remove ${p.name}`}
                  onClick={() => removePlayer(p.id)}
                  disabled={players.length <= 2}
                  className="text-muted-foreground transition-colors hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section aria-label="Results" className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Trophy className="size-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Results</h2>
        </div>
        <ResultsPanel result={result} />
      </section>

      {/* Scorecard entry */}
      <section aria-label="Scorecard" className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Scorecard</h2>
        <Scorecard players={players} holes={holes} result={result} onScore={setScore} />
      </section>
    </div>
  )
}

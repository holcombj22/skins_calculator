import { Flag } from "lucide-react"
import type { Player, SkinsResult } from "@/lib/skins"

export function Scorecard({
  players,
  holes,
  result,
  onScore,
}: {
  players: Player[]
  holes: number
  result: SkinsResult
  onScore: (id: string, holeIndex: number, value: number | null) => void
}) {
  const holeNumbers = Array.from({ length: holes }, (_, i) => i + 1)

  return (
    <div className="overflow-x-auto rounded-xl border border-border/80 bg-card shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/60">
            <th className="sticky left-0 z-10 bg-muted/60 px-3 py-2.5 text-left font-semibold">
              Hole
            </th>
            {holeNumbers.map((h) => {
              const hole = result.holes[h - 1]
              return (
                <th key={h} className="min-w-11 px-2 py-2.5 text-center font-semibold">
                  <div className="flex flex-col items-center gap-0.5">
                    <span>{h}</span>
                    {hole?.carried && (
                      <span
                        className="text-[10px] font-medium text-gold-foreground"
                        title="Tied - skin carried over"
                      >
                        push
                      </span>
                    )}
                  </div>
                </th>
              )
            })}
            <th className="px-3 py-2.5 text-center font-semibold">
              <span className="inline-flex items-center gap-1">
                <Flag className="size-3.5" aria-hidden="true" />
                Total
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => {
            const total = p.scores.reduce<number>((sum, s) => sum + (s ?? 0), 0)
            return (
              <tr key={p.id} className="border-b border-border last:border-b-0">
                <td className="sticky left-0 z-10 max-w-32 truncate bg-card px-3 py-1.5 font-medium">
                  {p.name}
                </td>
                {holeNumbers.map((h) => {
                  const idx = h - 1
                  const hole = result.holes[idx]
                  const isWinner = hole?.winnerId === p.id
                  const value = p.scores[idx]
                  return (
                    <td key={h} className="px-1 py-1 text-center">
                      <input
                        aria-label={`${p.name} score on hole ${h}`}
                        inputMode="numeric"
                        value={value ?? ""}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^0-9]/g, "")
                          onScore(p.id, idx, raw === "" ? null : Number.parseInt(raw, 10))
                        }}
                        className={
                          "size-9 rounded-md border text-center outline-none transition-colors focus:ring-2 focus:ring-ring " +
                          (isWinner
                            ? "border-primary bg-primary text-primary-foreground font-bold"
                            : "border-input bg-background")
                        }
                      />
                    </td>
                  )
                })}
                <td className="px-3 py-1.5 text-center font-semibold tabular-nums">
                  {total || "-"}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

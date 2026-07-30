import { Crown, Coins } from "lucide-react"
import type { SkinsResult } from "@/lib/skins"

function money(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function ResultsPanel({ result }: { result: SkinsResult }) {
  const ranked = [...result.totals].sort((a, b) => b.winnings - a.winnings || b.skins - a.skins)
  const topWinnings = ranked.length ? ranked[0].winnings : 0
  const hasWinner = topWinnings > 0

  return (
    <div className="flex flex-col gap-4">
      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryTile label="Total pot" value={money(result.perSkinValue * result.totalHoles)} />
        <SummaryTile label="Per hole" value={money(result.perSkinValue)} />
        <SummaryTile label="Skins won" value={String(result.decidedSkins)} />
        <SummaryTile
          label="Carrying over"
          value={
            result.carriedSkins > 0
              ? `${result.carriedSkins} (${money(result.unresolvedValue)})`
              : "None"
          }
          highlight={result.carriedSkins > 0}
        />
      </div>

      {/* Standings */}
      <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
        <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 border-b border-border bg-muted/60 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span className="w-6 text-center">#</span>
          <span>Player</span>
          <span className="text-right">Skins</span>
          <span className="text-right">Winnings</span>
        </div>
        <ul>
          {ranked.map((t, i) => {
            const isLeader = hasWinner && t.winnings === topWinnings
            return (
              <li
                key={t.id}
                className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 odd:bg-background even:bg-muted/20"
              >
                <span className="flex w-6 justify-center">
                  {isLeader ? (
                    <Crown className="size-4 text-gold" aria-label="Leader" />
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">{i + 1}</span>
                  )}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">{t.name}</span>
                  {t.holesWon.length > 0 && (
                    <span className="truncate text-xs text-muted-foreground">
                      Holes: {t.holesWon.join(", ")}
                    </span>
                  )}
                </span>
                <span className="text-right tabular-nums font-medium">{t.skins}</span>
                <span
                  className={
                    "text-right tabular-nums font-semibold " +
                    (t.winnings > 0 ? "text-primary" : "text-muted-foreground")
                  }
                >
                  {money(t.winnings)}
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      {result.carriedSkins > 0 && (
        <p className="flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-sm text-gold-foreground shadow-sm">
          <Coins className="size-4 shrink-0" aria-hidden="true" />
          {result.carriedSkins} skin{result.carriedSkins > 1 ? "s" : ""} worth{" "}
          {money(result.unresolvedValue)} {result.carriedSkins > 1 ? "are" : "is"} still up for
          grabs (tied or unplayed holes).
        </p>
      )}
    </div>
  )
}

function SummaryTile({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={
        "flex flex-col gap-1 rounded-xl border p-3 shadow-sm " +
        (highlight ? "border-gold/50 bg-gold/10" : "border-border bg-card")
      }
    >
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-lg font-bold tabular-nums">{value}</span>
    </div>
  )
}

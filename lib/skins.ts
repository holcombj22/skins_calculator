export type Player = {
  id: string
  name: string
  // scores[holeIndex] = strokes, or null if not entered
  scores: (number | null)[]
}

export type HoleResult = {
  hole: number
  // strokes this hole per player id (null if missing)
  scores: Record<string, number | null>
  // player id who won the skin(s) this hole, or null if carried/incomplete
  winnerId: string | null
  // how many skins were awarded/decided on this hole (includes carryovers)
  skinsAwarded: number
  // dollar value won on this hole
  value: number
  // true if the hole was pushed (tie) and value carried forward
  carried: boolean
  // true if not every player has a score entered yet
  incomplete: boolean
  // number of skins riding on this hole (current + carried in)
  skinsInPlay: number
}

export type PlayerTotal = {
  id: string
  name: string
  skins: number
  winnings: number
  holesWon: number[]
}

export type SkinsResult = {
  holes: HoleResult[]
  totals: PlayerTotal[]
  perSkinValue: number
  totalHoles: number
  decidedSkins: number
  carriedSkins: number
  unresolvedValue: number
}

/**
 * Calculate a skins game.
 * The pot is divided evenly by the number of holes -> value per skin.
 * Each hole, the outright lowest score wins all skins in play.
 * When carryOver is true (default), a tie for lowest pushes the skin(s)
 * forward to the next hole. When false, tied holes are voided and the
 * skin for that hole is not awarded.
 */
export function calculateSkins(
  players: Player[],
  totalHoles: number,
  pot: number,
  carryOver = true,
): SkinsResult {
  const perSkinValue = totalHoles > 0 ? pot / totalHoles : 0

  const totalsMap: Record<string, PlayerTotal> = {}
  for (const p of players) {
    totalsMap[p.id] = { id: p.id, name: p.name, skins: 0, winnings: 0, holesWon: [] }
  }

  const holes: HoleResult[] = []
  let carriedSkins = 0

  for (let h = 0; h < totalHoles; h++) {
    const scores: Record<string, number | null> = {}
    const entered: { id: string; score: number }[] = []

    for (const p of players) {
      const s = p.scores[h]
      scores[p.id] = s ?? null
      if (s !== null && s !== undefined && !Number.isNaN(s)) {
        entered.push({ id: p.id, score: s })
      }
    }

    const skinsInPlay = carriedSkins + 1
    const incomplete = players.length === 0 || entered.length < players.length

    if (incomplete) {
      // Can't decide this hole yet; skins stay in play but don't carry past the game end here.
      holes.push({
        hole: h + 1,
        scores,
        winnerId: null,
        skinsAwarded: 0,
        value: 0,
        carried: false,
        incomplete: true,
        skinsInPlay,
      })
      // Do not advance carried skins on incomplete holes.
      continue
    }

    const lowest = Math.min(...entered.map((e) => e.score))
    const leaders = entered.filter((e) => e.score === lowest)

    if (leaders.length === 1) {
      const winnerId = leaders[0].id
      const value = skinsInPlay * perSkinValue
      totalsMap[winnerId].skins += skinsInPlay
      totalsMap[winnerId].winnings += value
      totalsMap[winnerId].holesWon.push(h + 1)
      holes.push({
        hole: h + 1,
        scores,
        winnerId,
        skinsAwarded: skinsInPlay,
        value,
        carried: false,
        incomplete: false,
        skinsInPlay,
      })
      carriedSkins = 0
    } else {
      // Tie -> push (carry over) or void (no carry over)
      holes.push({
        hole: h + 1,
        scores,
        winnerId: null,
        skinsAwarded: 0,
        value: 0,
        carried: carryOver,
        incomplete: false,
        skinsInPlay,
      })
      carriedSkins = carryOver ? skinsInPlay : 0
    }
  }

  const totals = players.map((p) => totalsMap[p.id])
  const decidedSkins = totals.reduce((sum, t) => sum + t.skins, 0)

  return {
    holes,
    totals,
    perSkinValue,
    totalHoles,
    decidedSkins,
    carriedSkins,
    unresolvedValue: carriedSkins * perSkinValue,
  }
}

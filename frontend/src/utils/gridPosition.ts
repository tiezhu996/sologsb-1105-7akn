import type { GridPosition, PlacePair } from '../types/placePair'

/** 九宫格布阵：上中下三行、左中右三列，北在上。 */
export const GRID_LAYOUT: GridPosition[][] = [
  ['西北', '北', '东北'],
  ['西', '中', '东'],
  ['西南', '南', '东南'],
]

export const GRID_DIRECTION_LABELS: Record<GridPosition, string> = {
  北: '北 · N',
  东北: '东北 · NE',
  东: '东 · E',
  东南: '东南 · SE',
  南: '南 · S',
  西南: '西南 · SW',
  西: '西 · W',
  西北: '西北 · NW',
  中: '中部 · CENTER',
}

const COMPOUND_POSITIONS: GridPosition[] = ['东北', '东南', '西南', '西北']
const SINGLE_DIRECTIONS: GridPosition[] = ['东', '南', '西', '北']

/**
 * 从图上方位文字里辨认九宫方位，只凭东、南、西、北、中、角、部等字样判断。
 * 认不出方向时返回 null，由调用方决定如何处置。
 */
export function parseGridPosition(note: string): GridPosition | null {
  const text = note.trim()
  if (!text) {
    return null
  }

  // “偏某方”以所偏方向为准，如“中部偏南”归南格。
  const leanMatch = text.match(/偏([东南西北])/)
  if (leanMatch?.[1]) {
    return leanMatch[1] as GridPosition
  }

  // 复合方向成角，如“西南角”“东北部”。
  const compound = COMPOUND_POSITIONS.find((position) => text.includes(position))
  if (compound) {
    return compound
  }

  // 明言中部、中心，归中格。
  if (text.includes('中')) {
    return '中'
  }

  // 取文中最早出现的单一方向，如“图幅东侧……向北贯穿”归东格。
  let earliest: GridPosition | null = null
  let earliestIndex = Number.POSITIVE_INFINITY
  for (const direction of SINGLE_DIRECTIONS) {
    const index = text.indexOf(direction)
    if (index >= 0 && index < earliestIndex) {
      earliestIndex = index
      earliest = direction
    }
  }
  return earliest
}

export interface ResolvedGridPosition {
  position: GridPosition
  /** 仅凭文字认不出方向、暂放中格的记录标为方位待核。 */
  pending: boolean
}

/**
 * 定每条地名落在九宫哪一格：表单已选方位的直接采用；
 * 只有文字的老记录按方位描述推断，认不出的暂放中格并标方位待核。
 */
export function resolveGridPosition(pair: PlacePair): ResolvedGridPosition {
  if (pair.gridPosition) {
    return { position: pair.gridPosition, pending: false }
  }
  const parsed = parseGridPosition(pair.coordNote)
  if (parsed) {
    return { position: parsed, pending: false }
  }
  return { position: '中', pending: true }
}

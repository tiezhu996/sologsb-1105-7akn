import type { Bearing } from '../types/placePair'

export interface BearingInference {
  bearing: Bearing
  /** 方位文字里认不出方向时为 true，需人工再核 */
  pending: boolean
}

/**
 * 从图上方位文字辨认九宫格方位。
 * 规则：复合方向（东北、东南、西北、西南）优先；“中部/中心/中央/中间 + 偏X”按偏向落格；
 * 单独的东、南、西、北、中各归本格；角、部、侧、端等字样依附其前的方向字。
 * 整段文字找不到方向字样时，暂归中格并标方位待核。
 */
const BEARING_PATTERN = /东北|东南|西北|西南|中(?:部|心|央|间)?偏([东南西北])|东|南|西|北|中/

export function inferBearingFromNote(note: string): BearingInference {
  const match = BEARING_PATTERN.exec(note)
  if (!match) {
    return { bearing: '中', pending: true }
  }
  const [word, leaned] = match
  if (leaned) {
    return { bearing: leaned as Bearing, pending: false }
  }
  return { bearing: word as Bearing, pending: false }
}

export type PlaceType = '山川' | '村镇' | '衙署' | '桥梁'
export type Certainty = '确定' | '存疑' | '待考'
export type GridPosition = '北' | '东北' | '东' | '东南' | '南' | '西南' | '西' | '西北' | '中'

export interface PlacePair {
  id: string
  sheetId: string
  oldName: string
  newName: string
  aliasList: string[]
  placeType: PlaceType
  coordNote: string
  certainty: Certainty
  /** 九宫方位格。老记录缺省，展示时按 coordNote 文字推断。 */
  gridPosition?: GridPosition
}

export const PLACE_TYPES: PlaceType[] = ['山川', '村镇', '衙署', '桥梁']
export const CERTAINTIES: Certainty[] = ['确定', '存疑', '待考']
export const GRID_POSITIONS: GridPosition[] = ['北', '东北', '东', '东南', '南', '西南', '西', '西北', '中']

export type PlaceType = '山川' | '村镇' | '衙署' | '桥梁'
export type Certainty = '确定' | '存疑' | '待考'
export type Bearing = '西北' | '北' | '东北' | '西' | '中' | '东' | '西南' | '南' | '东南'

export interface PlacePair {
  id: string
  sheetId: string
  oldName: string
  newName: string
  aliasList: string[]
  placeType: PlaceType
  coordNote: string
  certainty: Certainty
  bearing: Bearing
  /** 方位文字认不出方向时为 true，记录暂置中格并标出方位待核 */
  bearingPending: boolean
}

export const PLACE_TYPES: PlaceType[] = ['山川', '村镇', '衙署', '桥梁']
export const CERTAINTIES: Certainty[] = ['确定', '存疑', '待考']
export const BEARINGS: Bearing[] = ['西北', '北', '东北', '西', '中', '东', '西南', '南', '东南']

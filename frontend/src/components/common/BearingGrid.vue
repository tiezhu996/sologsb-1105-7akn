<script setup lang="ts">
import { computed } from 'vue'
import type { Bearing, Certainty, PlacePair } from '../../types/placePair'

interface BearingSlot {
  key: Bearing
  en: string
  areaClass: string
}

/** 上中下三行、左中右三列，按阅读顺序排布 */
const SLOTS: BearingSlot[] = [
  { key: '西北', en: 'NW', areaClass: 'bearing-northwest' },
  { key: '北', en: 'N', areaClass: 'bearing-north' },
  { key: '东北', en: 'NE', areaClass: 'bearing-northeast' },
  { key: '西', en: 'W', areaClass: 'bearing-west' },
  { key: '中', en: 'CENTER', areaClass: 'bearing-center' },
  { key: '东', en: 'E', areaClass: 'bearing-east' },
  { key: '西南', en: 'SW', areaClass: 'bearing-southwest' },
  { key: '南', en: 'S', areaClass: 'bearing-south' },
  { key: '东南', en: 'SE', areaClass: 'bearing-southeast' },
]

const props = defineProps<{
  pairs: PlacePair[]
}>()

const certaintyType: Record<Certainty, 'success' | 'warning' | 'danger'> = {
  确定: 'success',
  存疑: 'warning',
  待考: 'danger',
}

const slots = computed(() =>
  SLOTS.map((slot) => ({
    ...slot,
    places: props.pairs
      .filter((pair) => pair.bearing === slot.key)
      .sort((left, right) => left.oldName.localeCompare(right.oldName, 'zh-CN')),
  })),
)

const pendingCount = computed(() => props.pairs.filter((pair) => pair.bearingPending).length)
</script>

<template>
  <div class="bearing-grid" data-testid="bearing-grid">
    <section
      v-for="slot in slots"
      :key="slot.key"
      class="bearing-cell"
      :class="[slot.areaClass, { 'bearing-cell--center': slot.key === '中' }]"
      :data-testid="`bearing-cell-${slot.en.toLowerCase()}`"
    >
      <header class="bearing-cell__head">
        <span class="bearing-cell__direction">{{ slot.key }} · {{ slot.en }}</span>
        <span class="bearing-cell__count">{{ slot.places.length }} 条</span>
      </header>
      <ul v-if="slot.places.length" class="bearing-cell__list">
        <li v-for="place in slot.places" :key="place.id" class="bearing-place">
          <div class="bearing-place__line">
            <strong class="bearing-place__old">{{ place.oldName }}</strong>
            <el-tag size="small" :type="certaintyType[place.certainty]" effect="light">
              {{ place.certainty }}
            </el-tag>
          </div>
          <p class="bearing-place__new">今：{{ place.newName }}</p>
          <el-tag v-if="place.bearingPending" size="small" type="warning" effect="plain">方位待核</el-tag>
        </li>
      </ul>
      <p v-else class="bearing-cell__empty">暂无地名落入此格</p>
    </section>
  </div>
  <p v-if="pendingCount" class="bearing-grid__note">
    有 {{ pendingCount }} 条记录的方位文字认不出方向，已暂置中格并标出方位待核。
  </p>
</template>

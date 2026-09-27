<script setup lang="ts">
import { computed } from 'vue'
import type { Certainty, GridPosition, PlacePair } from '../../types/placePair'
import {
  GRID_DIRECTION_LABELS,
  GRID_LAYOUT,
  resolveGridPosition,
  type ResolvedGridPosition,
} from '../../utils/gridPosition'

const props = defineProps<{
  places: PlacePair[]
}>()

interface GridEntry {
  pair: PlacePair
  resolved: ResolvedGridPosition
}

interface GridCell {
  position: GridPosition
  entries: GridEntry[]
}

const certaintyType: Record<Certainty, 'success' | 'warning' | 'danger'> = {
  确定: 'success',
  存疑: 'warning',
  待考: 'danger',
}

const cells = computed<GridCell[]>(() => {
  const grouped = new Map<GridPosition, GridEntry[]>()
  for (const row of GRID_LAYOUT) {
    for (const position of row) {
      grouped.set(position, [])
    }
  }
  for (const pair of props.places) {
    const resolved = resolveGridPosition(pair)
    grouped.get(resolved.position)?.push({ pair, resolved })
  }
  return GRID_LAYOUT.flat().map((position) => ({
    position,
    entries: (grouped.get(position) ?? []).sort((left, right) =>
      left.pair.oldName.localeCompare(right.pair.oldName, 'zh-CN'),
    ),
  }))
})
</script>

<template>
  <div class="position-grid" data-testid="position-grid">
    <article
      v-for="cell in cells"
      :key="cell.position"
      class="position-cell"
      :class="{ 'position-cell--center': cell.position === '中' }"
      :data-position="cell.position"
      data-testid="position-cell"
    >
      <div class="position-cell__head">
        <span class="position-cell__direction">{{ GRID_DIRECTION_LABELS[cell.position] }}</span>
        <span v-if="cell.entries.length" class="position-cell__count">{{ cell.entries.length }} 条</span>
      </div>
      <div v-if="cell.entries.length" class="position-cell__entries">
        <div v-for="entry in cell.entries" :key="entry.pair.id" class="position-entry" data-testid="position-entry">
          <div class="position-entry__names">
            <strong>{{ entry.pair.oldName }}</strong>
            <span class="position-entry__arrow" aria-hidden="true">→</span>
            <span class="position-entry__new">{{ entry.pair.newName }}</span>
          </div>
          <div class="position-entry__tags">
            <el-tag size="small" :type="certaintyType[entry.pair.certainty]">{{ entry.pair.certainty }}</el-tag>
            <el-tag v-if="entry.resolved.pending" size="small" type="warning" effect="plain" data-testid="position-pending">
              方位待核
            </el-tag>
          </div>
        </div>
      </div>
      <p v-else class="position-cell__empty">—</p>
    </article>
  </div>
</template>

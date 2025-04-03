<script lang="ts" setup>
import type { Room } from '@/types/room/Room';

defineProps<{
  room: Room
}>();
</script>

<template>
  <v-btn class="room-item" color="primary">
    <div class="d-flex justify-space-between align-center">
      <div>
        <h3 class="room-name">{{ room.name }}</h3>
        <p class="player-count">players</p>
      </div>
      <v-icon right>mdi-arrow-right</v-icon>
    </div>
  </v-btn>
</template>

<style scoped>
.room-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.room-name {
  flex-grow: 1;
}

.room-arrow {
  margin-left: 10px;
}
</style>

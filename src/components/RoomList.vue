<template>
    <v-card class="my-3" :data-cy="`${listName.toLowerCase()}-list`">
        <v-card-title class="text-h6">{{ listName }}</v-card-title>
        
        <v-container v-if="isListEmpty" class="d-flex justify-center">
            <v-card-subtitle>No {{ listName.toLowerCase() }} available</v-card-subtitle>
        </v-container>

        <v-list v-else>
            <v-list-item
                v-for="room in rooms"
                :key="room.id"
                @click="handleRoomClick(room)"
                :data-cy="`room-${room.id}`"
                class="room-item"
            >
                <template v-slot:prepend>
                    <v-icon :color="room.status === 'opened' ? 'success' : 'grey'">
                        {{ room.status === 'opened' ? 'mdi-door-open' : 'mdi-door-closed' }}
                    </v-icon>
                </template>

                <v-list-item-title>{{ room.name }}</v-list-item-title>
                <v-list-item-subtitle>
                    Exchange rate: {{ room.exchange }}€
                </v-list-item-subtitle>

                <template v-slot:append>
                    <v-chip
                        size="small"
                        :color="room.status === 'opened' ? 'success' : 'grey'"
                        variant="outlined"
                    >
                        {{ room.status }}
                    </v-chip>
                </template>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script lang="ts" setup>
import type { Room } from '@/types/room/Room';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const props = defineProps<{
    listName: string,
    rooms: Room[],
}>();

const router = useRouter();

const isListEmpty = computed(() => {
    return !props.rooms || props.rooms.length === 0;
});

const handleRoomClick = (room: Room) => {
    router.push({ name: 'room', params: { id: room.id } });
};
</script>

<style scoped>
.room-item {
    cursor: pointer;
    transition: background-color 0.2s;
}

.room-item:hover {
    background-color: rgba(var(--v-theme-primary), 0.1);
}
</style>

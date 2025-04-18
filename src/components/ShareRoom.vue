<template>
  <div>
    <v-btn
      icon
      variant="text"
      color="primary"
      @click="dialog = true"
      data-cy="share-room-button"
    >
      <v-icon>mdi-share-variant</v-icon>
    </v-btn>

    <v-dialog v-model="dialog" max-width="400" data-cy="share-room-dialog">
      <v-card>
        <v-card-title class="text-h6 pa-4">
          Share Room
        </v-card-title>
        
        <v-card-text class="text-center pa-4">
          <div class="d-flex justify-center mb-4">
            <qrcode-vue
              :value="roomUrl"
              :size="200"
              level="H"
              render-as="svg"
              data-cy="room-qr-code"
            />
          </div>
          
          <v-alert v-if="copied" type="success" density="compact" variant="tonal" class="mb-2">
            URL copied to clipboard!
          </v-alert>
          
          <v-btn 
            block
            color="primary"
            @click="copyToClipboard"
            class="mt-2"
            data-cy="copy-room-url-button"
          >
            <v-icon start>mdi-content-copy</v-icon>
            Copy Link
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import QrcodeVue from 'qrcode.vue';

const props = defineProps<{
  roomId: number
}>();

const dialog = ref(false);
const copied = ref(false);

const roomUrl = computed(() => {
  // Get the base URL from the current window location
  const baseUrl = window.location.origin;
  return `${baseUrl}/room/${props.roomId}`;
});

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(roomUrl.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 3000); // Hide the alert after 3 seconds
  } catch (err) {
    console.error('Failed to copy URL: ', err);
  }
};
</script>

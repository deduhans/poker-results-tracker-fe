<template>
    <v-container fluid fill-height>
        <v-row justify="center">
            <v-col class="text-center">
                <v-btn color="primary" @click="login">Log In</v-btn>
                <v-btn color="secondary" @click="signup">Sign Up</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const login = () => {
    router.push({ name: 'login' });
};

const signup = () => {
    router.push({ name: 'signup' });
};
</script>
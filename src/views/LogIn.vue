<template>
    <v-card class="mt-16">
        <v-card-title class="text-center">Log in</v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid">
                <v-text-field v-model="userName" label="Name" required></v-text-field>
                <v-text-field v-model="password" label="Password" required></v-text-field>
            </v-form>
            <v-alert v-if="error" density="compact" variant="outlined" text="Incorrect login or password"
                type="error"></v-alert>
        </v-card-text>

        <v-card-actions>
            <v-btn color="primary" @click="register">Register</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="login">Log in</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
import AuthController from '@/network/lib/auth';
import type { Auth } from '@/types/auth/Auth';

const authController = new AuthController();

const userStore = useUserStore();
const router = useRouter();

const userName = ref('');
const password = ref('');
const valid = ref(false);

const error = ref<boolean>(false);

const register = () => {
    router.push({ name: 'register' })
}

const login = async () => {
    try {
        const auth: Auth = {
            username: userName.value,
            password: password.value
        };

        const user: any = await authController.login(auth);
        userStore.setUser({ userId: user.userId, name: user.username });

        router.push({ name: 'home' });
    } catch (e) {
        error.value = true;
        console.error('Error login:', e);
    }
}
</script>
<template>
    <v-card class="mt-16 mx-auto" max-width="400">
        <v-card-title class="text-center">Log in</v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="login">
                <v-text-field
                    v-model="userName"
                    label="Username"
                    :rules="userNameRules"
                    required
                    data-cy="username"
                    :disabled="loading"
                ></v-text-field>

                <v-text-field
                    v-model="password"
                    label="Password"
                    :rules="passwordRules"
                    required
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    data-cy="password"
                    :disabled="loading"
                ></v-text-field>
            </v-form>
            <v-alert
                v-if="error"
                density="compact"
                variant="outlined"
                :text="errorMessage"
                type="error"
                data-cy="error-alert"
            ></v-alert>
        </v-card-text>

        <v-card-actions>
            <v-btn
                color="secondary"
                @click="register"
                data-cy="register"
                :disabled="loading"
            >Register</v-btn>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                @click="login"
                data-cy="submit"
                :loading="loading"
                :disabled="!valid || loading"
            >Log in</v-btn>
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
const loading = ref(false);
const showPassword = ref(false);
const error = ref<boolean>(false);
const errorMessage = ref<string>('');

const userNameRules = [
    (v: string) => !!v || 'Username is required',
    (v: string) => (v && v.length >= 3) || 'Username must be at least 3 characters',
    (v: string) => (v && v.length <= 20) || 'Username must be less than 20 characters',
    (v: string) => /^[a-zA-Z0-9_-]+$/.test(v) || 'Username can only contain letters, numbers, underscores and dashes',
];

const passwordRules = [
    (v: string) => !!v || 'Password is required',
    (v: string) => (v && v.length >= 8) || 'Password must be at least 8 characters',
    (v: string) => /[A-Za-z]/.test(v) || 'Password must contain at least one letter',
    (v: string) => /[0-9]/.test(v) || 'Password must contain at least one number',
];

const register = () => {
    router.push({ name: 'register' });
};

const login = async () => {
    if (!valid.value) return;

    loading.value = true;
    error.value = false;
    errorMessage.value = '';

    try {
        const auth: Auth = {
            username: userName.value,
            password: password.value
        };

        const user = await authController.login(auth);
        userStore.setUser({ userId: user.userId, name: user.username });
        router.push({ name: 'home' });
    } catch (e: any) {
        error.value = true;
        errorMessage.value = e.response?.data?.message || 'Login failed. Please check your credentials.';
        console.error('Error login:', e);
    } finally {
        loading.value = false;
    }
};
</script>
import { writable } from 'svelte/store';
import { browser } from '$app/env';

export const keyword = writable('')
export const showModal = writable(false)
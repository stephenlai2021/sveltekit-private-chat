import { writable } from 'svelte/store';
import { browser } from '$app/env';

export const keyword = writable('')
export const showModal = writable(false)
export const showSettingsModal = writable(false)
export const activeItem = writable(null)

export const connection = writable(browser && localStorage.getItem("internet connection"))
connection.subscribe((val) => browser && localStorage.setItem("internet connection", val))

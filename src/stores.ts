import { writable, type Writable } from 'svelte/store';
import { Slide } from './classes/Slide';
import { Layouts, type Language } from './types';

/**
 * Whether the theme should be set to dark or not
 */
export const darkTheme: Writable<boolean> = writable(true);

/**
 * Current instance of the Reveal Plugin
 */
export const RevealInstance: any = writable(null);

/**
 * Chosen layouts of the slides created by the user
 */
export const revealSlides: Writable<Array<Array<Slide>>> = writable([[new Slide(0, 0, "javascript", Layouts.MAIN)]]);

/**
 * Inner HTML of all the slides created by the user
 */
export const slidesHTML = writable("");

/**
 * Current horizontal slide the user is modifying
 */
export const currentSlideH: Writable<number> = writable(0);

/**
 * Current vertical slide the user is modifying
 */
export const currentSlideV: Writable<number> = writable(0);

/**
 * Current language selected by the user
 */
export const currentLanguage: Writable<Language> = writable("javascript");

/**
 * Name of the slide deck
 */
export const deckName: Writable<string> = writable("untitled");

/**
 * Whether the overview mode is active or not
 */
export const showOverview: Writable<boolean> = writable(false);

/**
 * Whether the help modal is active or not
 */
export const showHelp: Writable<boolean> = writable(false);

/**
 * Whether the export modal is active or not
 */
export const showExport: Writable<boolean> = writable(false);

/**
 * Whether the self-hosting modal is active or not
 */
export const showSelfHosting: Writable<boolean> = writable(false);

/**
 * Whether the loading modal when exporting is active or not
 */
export const showExportingLoading: Writable<boolean> = writable(false);
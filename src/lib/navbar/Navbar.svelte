<script lang="ts">
    import LayoutMain from "./layouts/Layout-Main.svelte";
    import LayoutBody from "./layouts/Layout-Body.svelte";
    import LayoutColumns from "./layouts/Layout-Columns.svelte";
    import { Layouts, LayoutsNames, type Language } from "../../types";
    import { writable } from 'svelte/store';

    import {
        currentLanguage,
        revealSlides,
        currentSlideH,
        currentSlideV,
        RevealInstance,
        deckName,
        showHelp,
        darkTheme,
        showExport
    } from "../../stores";
    import { Slide } from "../../classes/Slide";
    import Theme from "../icons/Theme.svelte";

    /**
     * Initial deck name
     */
    let currentDeckName = "untitled";

    /**
     * Boolean indicating whether the user is currently exporting the deck
     */
    let savingFileDialog = false;

    /**
     * Update the deck name stored within the store when the user changes it
     */
    $: {
        deckName.set(currentDeckName);
    }

    /**
     * Reset the state of the application
     */
    function reset() {
        revealSlides.set([[new Slide(0, 0, "javascript", Layouts.MAIN)]]);
        $RevealInstance.slide(0, 0);
        setTimeout(() => {
            $RevealInstance.sync();
        }, 100);
    }

    let availableLanguages = ["javascript", "typescript", "sql", "p5", "processing"];

    /**
     * Change the current default language. Calling this function will:
     * - change the default programming language used when creating a new slide
     * - change the programming language used in the current slide
     * 
     * @param {MouseEvent} event event that triggered the function
     */
    
    function setCurrentLanguage(event: MouseEvent): void {
        // Get the selected language
        $currentLanguage = (
            event.target as HTMLLinkElement
        ).textContent.replace(/\s[✅⬇]/, '').toLowerCase() as Language;

        // Check if the language is available
        if (!availableLanguages.includes($currentLanguage)) {
            // It is not available, request it
            var langSize = "";
            switch ($currentLanguage) {
                case "python":
                    langSize = "21.3"
                    break;
                case "java":
                    langSize = "12.3"
                    break;
                case "cpp":
                    langSize = "58.1"
                    break;
                default:
                    console.warn("Language not recognized");
                    break;
            }
            let printString = 'You will need to import up to ' + langSize + ' MB. Is that ok?';
            if (window.confirm(printString)) {
                localStorage.setItem('importedLanguage', JSON.stringify($currentLanguage));
                availableLanguages = [...availableLanguages, $currentLanguage];
            }
        } else {
            // Change the programming language used in the current slide
            $revealSlides[$currentSlideH][$currentSlideV].setLanguage(
                $currentLanguage
            );

            revealSlides.set($revealSlides);
        }
    }

    // function updateNavbar() {
    //     const resultLang = localStorage.getItem('resultLanguage');
    //     if(resultLang)
    //     var readLanguage = JSON.parse(resultLang);
    //     if (!availableLanguages.includes(resultLang)) {
    //         availableLanguages = [...availableLanguages, resultLang];
    //     }
    // }

    // setInterval(updateNavbar, 1000); // Check for updates every second
</script>

<nav class="flex flex-row items-center justify-between h-[30px] bg-primary text-black dark:text-white">
    <div class="flex flex-row items-center ml-2">
        <div
            class="cursor-pointer text-left transition-all block hover:bg-secondary action-item group/main"
        >
            <div class="overflow-hidden">
                <p class="py-1 px-2 text-sm">File</p>
                <div
                    class="dropdown-content absolute m-0 bg-primary-light hidden w-[170px] flex flex-col z-50 group-hover/main:flex"
                >
                    <!-- <button
                        class="p-1 text-sm text-black float-none text-left no-underline hover:bg-secondary hover:text-[#f9f9f9]"
                        >Open</button
                    > -->
                    <button
                        class="p-1 text-sm text-black float-none text-left no-underline hover:bg-secondary hover:text-[#f9f9f9]"
                        on:click={() => showExport.set(true)}>Export slides</button
                    >
                    <button
                        class="p-1 text-sm text-black float-none text-left no-underline hover:bg-secondary hover:text-[#f9f9f9]"
                        on:click={reset}>Reset slides</button
                    >
                </div>
            </div>
        </div>
        <div
            class="cursor-pointer text-left transition-all block hover:bg-secondary action-item"
            on:click={() => showHelp.set(true)}
        >
            <p class="py-1 px-2 text-sm">Help</p>
        </div>
        <div class="ml-6 h-[10px] border-r-[1px] border-black dark:border-white" />
        <div
            class="cursor-pointer text-left transition-all block hover:bg-secondary action-item group ml-6"
        >
            <div class="overflow-hidden">
                <p class="py-1 px-2 text-sm">
                    <strong>Selected Layout</strong> - {LayoutsNames[
                        $revealSlides[$currentSlideH][$currentSlideV].layout
                    ]}
                </p>
                <div
                    class="transform-modal-body dropdown-content absolute m-0 p-1 bg-primary-light hidden flex flex-col z-50 group-hover:grid"
                >
                    <LayoutMain
                        isActive={$revealSlides[$currentSlideH][$currentSlideV]
                            .layout == Layouts.MAIN}
                    />
                    <LayoutBody
                        isActive={$revealSlides[$currentSlideH][$currentSlideV]
                            .layout == Layouts.BODY}
                    />
                    <LayoutColumns
                        isActive={$revealSlides[$currentSlideH][$currentSlideV]
                            .layout == Layouts.COLUMNS}
                    />
                </div>
            </div>
        </div>
        <div class="ml-6 h-[10px] border-r-[1px] border-black dark:border-white" />
        <div
            class="cursor-pointer text-left transition-all block hover:bg-secondary action-item group ml-6"
        >
            <div class="overflow-hidden">
                <p class="py-1 px-2 text-sm">
                    <strong>Selected language</strong> -
                    {$currentLanguage.charAt(0).toUpperCase() +
                        $currentLanguage.slice(1)}
                </p>
                <div
                    class="dropdown-content absolute m-0 bg-primary-light hidden flex flex-col z-50 group-hover:flex"
                >
                    <button
                        class="p-1 text-sm text-black float-none text-left no-underline hover:bg-secondary hover:text-[#f9f9f9] flex w-full items-center"
                        on:click={setCurrentLanguage}>
                        <span class="flex-1">Python</span>
                        <span>{availableLanguages.includes("python") ? '✅' : '⬇'}</span>
                    </button>
                    <button
                        class="p-1 text-sm text-black float-none text-left no-underline hover:bg-secondary hover:text-[#f9f9f9] flex w-full items-center"
                        on:click={setCurrentLanguage}>
                        <span class="flex-1">Typescript</span>
                        <span>{availableLanguages.includes("typescript") ? '✅' : '⬇'}</span>
                    </button>
                    <button
                        class="p-1 text-sm text-black float-none text-left no-underline hover:bg-secondary hover:text-[#f9f9f9] flex w-full items-center"
                        on:click={setCurrentLanguage}>
                        <span class="flex-1">Javascript</span>
                        <span>{availableLanguages.includes("javascript") ? '✅' : '⬇'}</span>
                    </button>
                    <button
                        class="p-1 text-sm text-black float-none text-left no-underline hover:bg-secondary hover:text-[#f9f9f9] flex w-full items-center"
                        on:click={setCurrentLanguage}>
                        <span class="flex-1">Java</span>
                        <span>{availableLanguages.includes("java") ? '✅' : '⬇'}</span>
                    </button>
                    <button
                        class="p-1 text-sm text-black float-none text-left no-underline hover:bg-secondary hover:text-[#f9f9f9] flex w-full items-center"
                        on:click={setCurrentLanguage}>
                        <span class="flex-1">Cpp</span>
                        <span>{availableLanguages.includes("cpp") ? '✅' : '⬇'}</span>
                    </button>
                    <button
                        class="p-1 text-sm text-black float-none text-left no-underline hover:bg-secondary hover:text-[#f9f9f9] flex w-full items-center"
                        on:click={setCurrentLanguage}>
                        <span class="flex-1">Sql</span>
                        <span>{availableLanguages.includes("sql") ? '✅' : '⬇'}</span>
                    </button>
                    <button
                        class="p-1 text-sm text-black float-none text-left no-underline hover:bg-secondary hover:text-[#f9f9f9] flex w-full items-center"
                        on:click={setCurrentLanguage}>
                        <span class="flex-1">P5</span>
                        <span>{availableLanguages.includes("p5") ? '✅' : '⬇'}</span>
                    </button>
                    <button
                        class="p-1 text-sm text-black float-none text-left no-underline hover:bg-secondary hover:text-[#f9f9f9] flex w-full items-center"
                        on:click={setCurrentLanguage}>
                        <span class="flex-1">Processing</span>
                        <span>{availableLanguages.includes("processing") ? '✅' : '⬇'}</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="ml-6 h-[10px] border-r-[1px] border-black dark:border-white" />
        <div class="flex flex-row ml-6">
            <p class="py-1 px-2 text-sm"><strong>Slide Deck name</strong> -</p>
            <p
                bind:innerHTML={currentDeckName}
                class="py-1 text-sm editable"
                contenteditable="true"
            >
                {$deckName}
            </p>
        </div>
    </div>
    <div class="absolute top-3 right-3 btn-shadow" on:click={() => {$darkTheme = !$darkTheme}}>
        <Theme />
    </div>
</nav>

<style>
    .dropdown-content {
        min-width: 8vw;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    }

    .transform-modal-body.dropdown-content {
        min-width: 15vw;
    }

    .transform-modal-body {
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 0.6em;
        grid-row-gap: 0.6em;
    }
</style>

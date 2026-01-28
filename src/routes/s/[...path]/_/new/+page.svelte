<script lang="ts">
    import { toAbsolutePath } from "$lib/utils/path_utils";
    import {
        createSub,
        createVirtualSub,
    } from "$lib/utils/site/actions/sub/create_sub";
    import { autoComplete } from "$lib/utils/site/autocomplete";
    import { resolvePath } from "$lib/utils/site/resolvepath";
    import type { Sub } from "$lib/utils/types/db/sub";

    // TODO: Handle if the user is accessing the url with a virtual sub in the path
    import type { NewSubPageData } from "$lib/utils/types/new_sub";
    import Swal from "sweetalert2";

    export let data: NewSubPageData;

    const FORM_TEMPLATE_DATA = {
        isVirtual: false,
        description: "",
        subName: "",
        vSubQuery: "",
    };

    let formData: typeof FORM_TEMPLATE_DATA = { ...FORM_TEMPLATE_DATA }; // We can do typeof obj? Cool asf

    $: createButtonText = `Create ${formData.isVirtual ? "Virtual" : ""} Sub`;

    let foundSubs: Sub[] = [];

    let lastAutocompleteRefresh = Date.now();

    let timeout: ReturnType<typeof setTimeout> | null = null;

    async function onCreateClick() {
        if (!data.subs && data.full.length !== 0) return; // To make VSCode happy
        if (!formData.subName.match(/^[a-zA-Z0-9]+$/)) {
            Swal.fire({
                icon: "error",
                title: "Invalid subname",
                text: "The sub name should have ONLY: characters from a to z (A-Z also) and 0-9, > than 1",
            });
        } else {
            if (formData.isVirtual) {
                // A: Perform validation
                if (formData.vSubQuery.startsWith("s/")) {
                    formData.vSubQuery = formData.vSubQuery.substring(2);
                }

                const targetSub = await resolvePath(formData.vSubQuery, fetch);

                if (!targetSub) {
                    Swal.fire({
                        icon: "error",
                        title: "Target Sub not found",
                        text: `The target sub "${formData.vSubQuery}" does not exist.`,
                    });
                } else {
                    if (!formData.vSubQuery.startsWith("s/")) {
                        formData.vSubQuery = "s/" + formData.vSubQuery;
                    }
                    let alreadyExists = false;
                    for (const child of data.childs) {
                        // Case-Sensitive
                        if (child.name === formData.subName) {
                            alreadyExists = true;
                            break;
                        }
                    }
                    if (alreadyExists) {
                        Swal.fire({
                            icon: "error",
                            title: "Sub already exists",
                            text: `A sub with the name "${formData.subName}" already exists under s/${data.full}.`,
                        });
                    } else {
                        // B: Send creation request
                        const createdSub = await createVirtualSub(
                            data.subs,
                            targetSub,
                            formData.subName,
                            fetch,
                        );
                        if (createdSub) {
                            await Swal.fire({
                                icon: "success",
                                title: "Sub link created!",
                                text: `Virtual sub s/${data.full + "/" + createdSub.name} pointing to s/${targetSub.fullPath} created successfully!`,
                            });
                            location.href = toAbsolutePath("../../");
                        } // No else, the createVirtualSub already handled the error display
                    }
                }
            } else {
                let alreadyExists = false;
                for (const child of data.childs) {
                    // Case-Sensitive
                    if (child.name === formData.subName) {
                        alreadyExists = true;
                        break;
                    }
                }
                if (alreadyExists) {
                    Swal.fire({
                        icon: "error",
                        title: "Sub already exists",
                        text: `A sub with the name "${formData.subName}" already exists under s/${data.full}.`,
                    });
                } else {
                    // B: Send creation request
                    const sub = await createSub(
                        formData.subName,
                        data.subs,
                        formData.description,
                        fetch,
                    );
                    if (sub) {
                        await Swal.fire({
                            icon: "success",
                            title: "Sub created!",
                            text: `Sub s/${data.full}/${sub.name} created successfully!`,
                        });
                        location.href = toAbsolutePath("../../");
                    } // No else, the createSub already handled the error display
                }
            }
        }
    }

    async function onInput() {
        if (
            Date.now() - lastAutocompleteRefresh <
            import.meta.env.VITE_AUTOCOMPLETE_UPDATE_MS
        ) {
            if (timeout) {
                clearTimeout(timeout);
            }
            lastAutocompleteRefresh = Date.now();
            timeout = setTimeout(
                async () => {
                    foundSubs = await autoComplete(formData.vSubQuery, fetch);
                    lastAutocompleteRefresh = Date.now();
                },
                import.meta.env.VITE_AUTOCOMPLETE_UPDATE_MS,
            );
        } else {
            foundSubs = await autoComplete(formData.vSubQuery, fetch);
            if (timeout) {
                clearTimeout(timeout);
            }
            lastAutocompleteRefresh = Date.now();
        }
    }
</script>

<svelte:head>
    <title>Add Sub - s/{data.full} - Showcase</title>
</svelte:head>

{#if data.subs !== null || data.full.length === 0}
    <h1>Sub creation</h1>
    <article>
        <a href={"/s/" + data.full}>Back</a>
        <form
            on:submit={(e) => {
                e.preventDefault();
            }}
        >
            <h2>
                Create a new {formData.isVirtual ? "virtual" : ""} sub under s/{data.full}
            </h2>
            <!-- svelte-ignore a11y_no_redundant_roles -->
            <div class="df">
                <label for="isVirtual">Virtual Sub?</label>
                <input
                    type="checkbox"
                    bind:checked={formData.isVirtual}
                    id="isVirtual"
                />
            </div>

            {#if formData.isVirtual}
                <div>
                    <h3>Virtual Sub Target</h3>
                    <input
                        on:input={onInput}
                        bind:value={formData.vSubQuery}
                        type="text"
                        required
                        placeholder="Target Sub (s/...)"
                    />
                    {#if foundSubs.length > 0}
                        <div class="autocomplete">
                            <ul>
                                {#each foundSubs as foundSub}
                                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                                    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                                    <li
                                        on:click={() => {
                                            formData.vSubQuery =
                                                "s/" +
                                                (foundSub.fullPath || "");
                                            foundSubs = [];
                                        }}
                                    >
                                        s/{foundSub.fullPath}: {foundSub.description}
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/if}
                </div>
            {:else}
                <textarea
                    bind:value={formData.description}
                    required
                    placeholder="Sub description"
                ></textarea>
            {/if}

            <!-- svelte-ignore a11y_no_redundant_roles -->
            <fieldset role="group">
                <input
                    bind:value={formData.subName}
                    type="text"
                    required
                    placeholder="Sub name"
                    pattern="[a-zA-Z0-9]+"
                />
                <button on:click={onCreateClick}>{createButtonText}</button>
            </fieldset>
        </form>
    </article>
    <article>
        <h2>Already existing subs</h2>
        <ul>
            {#each data.parentChilds as child}
                {#if child.isBuiltin}
                    <li>{child.name} (Reserved word)</li>
                {:else}
                    <li>s/{child.fullPath}: {child.description}</li>
                {/if}
            {/each}
        </ul>
    </article>
{:else}
    <h1>Sub {data.full} not found</h1>
{/if}

<style>
    textarea {
        resize: none;
    }
</style>

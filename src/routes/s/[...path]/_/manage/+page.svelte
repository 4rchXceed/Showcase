<script lang="ts">
    import { toAbsolutePath } from "$lib/utils/path_utils";
    import { modifySub } from "$lib/utils/site/actions/sub/modify_sub";
    import { autoComplete } from "$lib/utils/site/autocomplete";
    import { resolvePath } from "$lib/utils/site/resolvepath";
    import type { Sub } from "$lib/utils/types/db/sub";
    import type { ModifySubPageData } from "$lib/utils/types/mod_sub";

    // TODO: Handle if the user is accessing the url with a virtual sub in the path
    import Swal from "sweetalert2";

    export let data: ModifySubPageData;

    const FORM_TEMPLATE_DATA = {
        description: data.subs ? data.subs.description : "",
        subName: data.subs ? data.subs.name : "",
        newParent: "",
        changeParent: false,
    };

    let formData: typeof FORM_TEMPLATE_DATA = { ...FORM_TEMPLATE_DATA }; // We can do typeof obj? Cool asf

    let foundSubs: Sub[] = [];

    let lastAutocompleteRefresh = Date.now();

    let timeout: ReturnType<typeof setTimeout> | null = null;

    async function onCreateClick() {
        if (!data.subs || !data.subs.id) return; // To make VSCode happy
        if (!formData.subName.match(/^[a-zA-Z0-9]+$/)) {
            Swal.fire({
                icon: "error",
                title: "Invalid subname",
                text: "The sub name should have ONLY: characters from a to z (A-Z also) and 0-9, > than 1",
            });
        } else {
            let alreadyExists = false;
            for (const child of data.parentChilds) {
                // Case-Sensitive
                if (
                    child.name === formData.subName &&
                    child.name !== data.subs.name
                ) {
                    alreadyExists = true;
                    break;
                }
            }
            if (alreadyExists) {
                Swal.fire({
                    icon: "error",
                    title: "Sub already exists",
                    text: `A sub with the name "${formData.subName}" already exists under the parent of this sub.`,
                });
            } else {
                // B: Send creation request
                const isNewParentRoot = formData.newParent === "s/";
                if (formData.newParent.startsWith("s/")) {
                    formData.newParent = formData.newParent.substring(2);
                }

                let newParent = null;
                if (formData.changeParent) {
                    newParent = await resolvePath(formData.newParent, fetch);
                    if (!newParent && !isNewParentRoot) {
                        await Swal.fire({
                            icon: "error",
                            title: "Parent not found",
                            text: `No parent with path ${formData.newParent} found!`,
                        });
                        return; // Quit
                    }
                }

                const sub = await modifySub(
                    data.subs,
                    formData.subName,
                    formData.description,
                    isNewParentRoot,
                    newParent,
                    fetch,
                );
                if (sub) {
                    await Swal.fire({
                        icon: "success",
                        title: "Sub modified!",
                        text: `Sub s/${data.full} modified successfully!`,
                    });
                    location.href = toAbsolutePath("../../../");
                } else {
                    await Swal.fire({
                        icon: "error",
                        title: "An error occured",
                        text: "There was an error while updating the sub infos...",
                    });
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
                    foundSubs = await autoComplete(formData.newParent, fetch);
                    lastAutocompleteRefresh = Date.now();
                },
                import.meta.env.VITE_AUTOCOMPLETE_UPDATE_MS,
            );
        } else {
            foundSubs = await autoComplete(formData.newParent, fetch);
            if (timeout) {
                clearTimeout(timeout);
            }
            lastAutocompleteRefresh = Date.now();
        }
    }
</script>

<svelte:head>
    <title>Modify Sub - s/{data.full} - Showcase</title>
</svelte:head>

{#if data.subs !== null}
    <h1>Sub modification</h1>
    <article>
        <a href={"/s/" + data.full}>Back</a>
        <form
            on:submit={(e) => {
                e.preventDefault();
            }}
        >
            <h2>
                Modify the sub s/{data.full}
            </h2>

            <textarea
                bind:value={formData.description}
                required
                placeholder="Sub description"
            ></textarea>
            <div>
                <div class="df">
                    <h3>New parent</h3>
                    <input
                        type="checkbox"
                        bind:checked={formData.changeParent}
                    />
                </div>
                {#if formData.changeParent}
                    <input
                        on:input={onInput}
                        bind:value={formData.newParent}
                        type="text"
                        required
                        placeholder="Target Sub (s/...), s/ for root"
                    />
                    {#if foundSubs.length > 0}
                        <div class="autocomplete">
                            <ul>
                                {#each foundSubs as foundSub}
                                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                                    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                                    <li
                                        on:click={() => {
                                            formData.newParent =
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
                {/if}
            </div>

            <!-- svelte-ignore a11y_no_redundant_roles -->
            <fieldset role="group">
                <input
                    bind:value={formData.subName}
                    type="text"
                    required
                    placeholder="Sub name"
                    pattern="[a-zA-Z0-9]+"
                />
                <button on:click={onCreateClick}>Modify sub</button>
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

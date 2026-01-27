export interface Sub {
    id: string | null,
    fullPath: string | null, // Added to simplify path handling
    name: string,
    subId: string | null,
    description: string,
    subs: Sub[] | null, // This is for the db
    parent: Sub | null, // And this simplifies a hell lot of things
    isVirtual: boolean,
    targetId: string | null, // For virtual subs
    originalId: string | null, // Also for virtual subs
    isBuiltin: boolean
};

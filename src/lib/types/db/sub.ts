export interface Sub {
    id: String,
    name: String,
    subId: String | null,
    description: String,
    subs: Sub[] | null, // This is for the db
    parent: Sub | null // And this simplifies a hell lot of things
};

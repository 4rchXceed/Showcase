# ShowCase

A Reddit-type website to showcase some cool projects, arts, ...

### Vocabulary

- Sub: sub-community
- root sub: Sub with no parents (/s/[a-zA-Z0-9]+)

## How will it work?

### The community system
```
                        / -> Show the top popular posts
    /s/vocaloid                   /s/games
                                        /s/games/clairobscure33     ...
/s/vocaloid/dev /s/vocaloid/art...
```

But the community system is different from Reddit, because there's sub-categories (e.g. /s/games/clairobscure33 is a sub from /s/games).
You can post on:
- A final sub (without childs), within it's builtin category (see builtin categories)
- A sub with childs (e.g. /s/games), also within it's builtin category

### The post system

We can post:
- Images
- Audio
- Videos (**NOT HOSTED ON THE WEBSITE**)
- Text

### Builtin Categories

And there's builtin categories:
- /dev
- /art
- /text (general, Q & A)
- /music
- /animations
- /other

### The virtual link system
If a sub can also be in another category, you can create a virtual link between the parent and the child.

Example, the /s/vocaloid is root sub, but it can also be in /s/music, you can create a virtual link from /s/music/jp_vocaloid -> /s/vocaloid

### The user

A user can:
- Post in any categories
- Request a root category
- Request/Create a sub-root category
- Create a sub-sub-root category
- Get "verified" (see verification)

### Verification
[IF I HAVE THE TIME]

A user can be verified with 1-to-3 levels:
Level 1, posts shown in top
Level 2, can create sub-root category/virtual-link
Level 3, can create a root category/virtual-link

### Comments?
[IF I HAVE THE TIME]

Basic text comments support

## First part
At first, I'll do the community system

### Pages
/ -> Shows some root subs in a header (the main/posts will be added in part 2)
/s/[a-zA-Z0-9/]+
/_/s/new -> Create a new sub
/s/[a-zA-Z0-9/]+/_/delete -> Delete a sub

### Tables

```
sub
- name
- parentId -> null ok
- description

builtin_sub
- name
- description

virtual_sub
- parentId -> not null
- name
- targetId
- description
```
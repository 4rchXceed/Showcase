export function toAbsolutePath(path: string) {
    let absolutePath = location.href;
    if (!location.href.endsWith("/")) {
        absolutePath += "/";
    }
    absolutePath += path;
    return absolutePath;
}

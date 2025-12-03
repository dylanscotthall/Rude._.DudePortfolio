export function getFileNameWithoutExt(path: string) {
    const lastSegment = path.split("/").pop();
    return lastSegment ? lastSegment.split(".")[0] : "";
}

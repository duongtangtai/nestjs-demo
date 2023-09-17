export function formatDate(date: Date) {
    const arr = new Date(date.toString() + "Z").toISOString().split('T');
    const arr2 = arr[1].split(".")
    return arr[0] + " " + arr2[0]
}
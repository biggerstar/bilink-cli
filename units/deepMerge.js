export default function deepMerge(obj1, obj2) {
    let key;
    for (key in obj2) {
        obj1[key] = obj1[key] && obj1[key].toString() === "[object Object]"
        && (obj2[key] && obj2[key].toString() === "[object Object]")
            ? deepMerge(obj1[key], obj2[key]) : (obj1[key] = obj2[key]);
    }
    return obj1;
}

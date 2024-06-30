type Primitive = string | number | boolean | null | undefined;
export type MapValue = Primitive | NestedMap;
export interface NestedMap {
    [key: string]: MapValue;
}

export const convertMapToObject = (map: Map<string, MapValue>): NestedMap => {
    const obj: NestedMap = {};

    for (const [key, value] of map) {
        obj[key] =
            value instanceof Map
                ? convertMapToObject(value as Map<string, MapValue>)
                : value;
    }

    return obj;
};

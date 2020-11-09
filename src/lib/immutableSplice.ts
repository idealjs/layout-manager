const immutableSplice = <T>(
    array: T[],
    index: number,
    deleteNumber: number,
    insert: T[] | T
) => {
    return array
        .slice(0, index)
        .concat(insert)
        .concat(array.slice(index + deleteNumber));
};

export default immutableSplice;

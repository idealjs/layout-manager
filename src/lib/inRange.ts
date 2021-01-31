const inRange = (
    target: number,
    test: number | undefined,
    fluctuate: number
) => {
    if (test == null) return true;
    return target < test + fluctuate && target > test - fluctuate;
};
export default inRange;

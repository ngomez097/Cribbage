
class Utils {

    public copyNestedArray<T>(array: T[][]): T[][] {
        const out: T[][] = [];

        for(const subArray of array) {
            out.push([...subArray])
        }

        return out;
    }
}

export default new Utils();
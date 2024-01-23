export const paginate = (array: any[], pageSize: number, pageNumber: number) => {
    return {
        data: array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
        startIndex: (pageNumber - 1) * pageSize,
        endIndex: pageSize * pageNumber - 1,
    };
};

export const numberOfPages = (array: any[], pageSize: number) => {
    return Math.ceil(array.length / pageSize);
};

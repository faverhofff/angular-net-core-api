export interface EmptyResponseInterface {
    readonly recordsTotal: number,
    readonly recordsFiltered: number,
    readonly data: Array<void>,
    readonly error: string,
}
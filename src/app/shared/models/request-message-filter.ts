export interface RequestMessageFilter {
    start?: Date;
    end?: Date;
    with: string;
    afterId?: number;
    beforeId?: number;
    max?: number;
}
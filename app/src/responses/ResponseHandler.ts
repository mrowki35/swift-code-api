import { Response } from "express";

export function handleResponse<T>(
    res: Response, 
    endpoint_name: string, 
    item: T, 
    isEmptyPred: boolean
): void {
    if (isEmptyPred) {
        res.status(204).send();
    } else {
        res.status(200).json({[endpoint_name.startsWith("/") ? endpoint_name.slice(1) : endpoint_name] : toLowerCaseKeys(item)});
    }
}

function toLowerCaseKeys(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(item => toLowerCaseKeys(item));
    } else if (typeof obj === "object" && obj !== null) {
        return Object.keys(obj).reduce((acc, key) => {
            acc[key.toLowerCase()] = toLowerCaseKeys(obj[key]);
            return acc;
        }, {} as Record<string, any>);
    }
    return obj;
  }

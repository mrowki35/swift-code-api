import { Response } from "express";

export function handleResponse<T>(
  res: Response,
  endpoint_name: string,
  item: T,
  isEmptyPred: boolean,
): void {
  if (isEmptyPred) {
    res.status(204).send();
  } else {
    res.status(200).json(item);
  }
}

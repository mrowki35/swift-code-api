import { Response } from "express";
import { isCryptoKey } from "util/types";

// Keep T generic, but add constraint to handle objects or instances that can use Object.values()
export function handleResponse<T>(
  res: Response,
  endpoint_name: string, 
  item: T,
  isEmptyPred: boolean,
): void {

  if (isEmptyPred) {
    res.status(204).send();
  } else {
    // Send a 200 status with the values of 'item' directly (not wrapped in 'item' key)
    res.status(200).json(item);  // Assuming item is an object or array-like
  }
}

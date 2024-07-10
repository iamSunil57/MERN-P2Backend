//Global function to reduce use of try catch error handling

import { Request, Response } from "express";
import { Next } from "mysql2/typings/mysql/lib/parsers/typeCast";
const errorHandler = (fn: Function) => {
  return (req: Request, res: Response) => {
    fn(req, res).catch((err: Error) => {
      return res.status(500).json({
        message: "Internal Error",
        errorMessage: err.message,
      });
    });
  };
};
export default errorHandler;

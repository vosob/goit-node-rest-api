import { isValidObjectId } from "mongoose";
import HttpError from "./HttpError.js";

const isValidObjId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    next(
      HttpError(400, `${id} is not valid ID. Check entered ID and try again`)
    );
  }
  next();
};

export default isValidObjId;

import * as path from "node:path";
import * as crypto from "node:crypto";
import multer from "multer";

const storage = multer.diskStorage({
  // місце де зберігається файли
  destination(req, file, cb) {
    cb(null, path.join(process.cwd(), "tmp"));
  },
  filename(req, file, cb) {
    // file.originalname = example.png
    const extname = path.extname(file.originalname); // .png
    const basename = path.basename(file.originalname, extname); // example
    const suffix = crypto.randomUUID();

    cb(null, `${basename}-${suffix}${extname}`);
  },
});

export default multer({ storage });

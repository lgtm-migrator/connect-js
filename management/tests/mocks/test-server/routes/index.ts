import express from "express";

import addIdentityRouter from "./add-identity";
import updateIdentityRouter from "./update-identity";

const router = express.Router({ mergeParams: true });

router.use("/update-identity", updateIdentityRouter);
router.use("/add-identity", addIdentityRouter);

export default router;

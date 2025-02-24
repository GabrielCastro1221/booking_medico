const { Router } = require("express");
const NursesController = require("../controller/nurses.controller");
const upload = require("../middlewares/upload.middleware");
const AuthMiddleware = require("../middlewares/verifyToken.middleware");

const router = Router();
const nurses = new NursesController();
const auth = new AuthMiddleware();

router.get("/", nurses.getAllNurses);
router.get("/:id", nurses.getNursesById);
router.put(
  "/:id",
  upload.single("photo"),
  auth.authenticate,
  auth.restrict(["enfermera"]),
  nurses.updateNurse
);
router.delete(
  "/:id",
  auth.authenticate,
  auth.restrict(["enfermera", "admin"]),
  nurses.deleteNurse
);
router.get(
  "/profile/me",
  auth.authenticate,
  auth.restrict(["enfermera"]),
  nurses.getNurseProfile
);

router.put(
  "/:id/approval-status",
  auth.authenticate,
  auth.restrict(["admin"]),
  nurses.changeApprovalStatus
);
router.put(
  "/:id/cancelled-status",
  auth.authenticate,
  auth.restrict(["admin"]),
  nurses.cancelledStatus
);

module.exports = router;

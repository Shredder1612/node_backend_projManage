import { Router } from "express";
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from "../controllers/note.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { createNoteValidator } from "../validators/index.js";
import {
  verifyJWT,
  validatorProjectPermission,
} from "../middlewares/auth.middlewares.js";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/:projectId")
  .get(validatorProjectPermission(AvailableUserRoles), getNotes)
  .post(
    validatorProjectPermission([UserRolesEnum.ADMIN]),
    createNoteValidator(),
    validate,
    createNote,
  );

router
  .route("/:projectId/n/:noteId")
  .get(validatorProjectPermission(AvailableUserRoles), getNoteById)
  .put(
    validatorProjectPermission([UserRolesEnum.ADMIN]),
    createNoteValidator(),
    validate,
    updateNote,
  )
  .delete(validatorProjectPermission([UserRolesEnum.ADMIN]), deleteNote);

export default router;

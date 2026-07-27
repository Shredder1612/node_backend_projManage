import { Router } from "express";
import {
  createTask,
  createSubTask,
  deleteTask,
  deleteSubTask,
  getTasks,
  getTaskById,
  updateTask,
  updateSubTask,
} from "../controllers/task.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  createTaskValidator,
  createSubTaskValidator,
} from "../validators/index.js";
import {
  verifyJWT,
  validatorProjectPermission,
} from "../middlewares/auth.middlewares.js";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/:projectId")
  .get(validatorProjectPermission(AvailableUserRoles), getTasks)
  .post(
    validatorProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    upload.array("attachments", 5),
    createTaskValidator(),
    validate,
    createTask,
  );

router
  .route("/:projectId/t/:taskId")
  .get(validatorProjectPermission(AvailableUserRoles), getTaskById)
  .put(
    validatorProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    upload.array("attachments", 5),
    updateTask,
  )
  .delete(
    validatorProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    deleteTask,
  );

router
  .route("/:projectId/t/:taskId/subtasks")
  .post(
    validatorProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    createSubTaskValidator(),
    validate,
    createSubTask,
  );

router
  .route("/:projectId/st/:subTaskId")
  .put(validatorProjectPermission(AvailableUserRoles), updateSubTask)
  .delete(
    validatorProjectPermission([
      UserRolesEnum.ADMIN,
      UserRolesEnum.PROJECT_ADMIN,
    ]),
    deleteSubTask,
  );

export default router;

import { Router } from "express";
import {
  addMembersToProject,
  createProject,
  deleteMember,
  getProjects,
  getProjectsById,
  getProjectMembers,
  updateProjects,
  updateMemberRole,
  deleteProjects,
} from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  addMemberToProjectValidator,
  createProjectValidator,
} from "../validators/index.js";
import {
  verifyJWT,
  validatorProjectPermission,
} from "../middlewares/auth.middlewares.js";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/")
  .get(getProjects)
  .post(createProjectValidator(), validate, createProject);

router
  .route("/:project")
  .get(validatorProjectPermission(AvailableUserRoles), getProjectsById)
  .put(
    validatorProjectPermission([UserRolesEnum.ADMIN]),
    createProjectValidator(),
    validate,
    updateProjects,
  )
  .delete(validatorProjectPermission([UserRolesEnum.ADMIN]), deleteProjects);

router
  .route("/:projectId/members")
  .get(getProjectMembers)
  .post(
    validatorProjectPermission([UserRolesEnum.ADMIN]),
    addMemberToProjectValidator(),
    validate,
    addMembersToProject,
);
  
router
  .route("/:projectId/members/:userId")
  .put(validatorProjectPermission([UserRolesEnum.ADMIN]), updateMemberRole)
  .delete(validatorProjectPermission([UserRolesEnum.ADMIN]), deleteMember);


export default router;

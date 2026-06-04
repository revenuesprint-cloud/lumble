import { Router, type IRouter } from "express";
import healthRouter   from "./health";
import authRouter     from "./auth";
import profileRouter  from "./profile";
import meRouter       from "./me";
import problemsRouter from "./problems";
import contentRouter  from "./content";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth",     authRouter);
router.use("/profile",  profileRouter);
router.use("/me",       meRouter);
router.use("/problems", problemsRouter);
router.use("/content",  contentRouter);

export default router;

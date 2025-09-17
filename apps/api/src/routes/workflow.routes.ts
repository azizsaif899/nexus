import { Router } from 'express';
import { WorkflowController } from '../controllers/workflow.controller';

const router = Router();

// مسارات workflows
router.get('/', WorkflowController.getAllWorkflows);
router.get('/:id', WorkflowController.getWorkflowById);
router.post('/', WorkflowController.createWorkflow);
router.put('/:id', WorkflowController.updateWorkflow);
router.delete('/:id', WorkflowController.deleteWorkflow);
router.post('/:id/execute', WorkflowController.executeWorkflow);

export default router;
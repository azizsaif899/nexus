import { bigquery, workflowsTable, executionsTable } from '../database/bigquery-connection';
import { v4 as uuidv4 } from 'uuid';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: any[];
  connections: any[];
  status: 'draft' | 'active' | 'paused' | 'archived';
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_active: boolean;
}

export class BigQueryWorkflowModel {
  static async create(workflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'>): Promise<Workflow> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const newWorkflow = {
      id,
      ...workflow,
      created_at: now,
      updated_at: now
    };

    await workflowsTable.insert([newWorkflow]);
    return newWorkflow as Workflow;
  }

  static async findAll(): Promise<Workflow[]> {
    const query = `
      SELECT * FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.workflows_dataset.workflows\`
      ORDER BY created_at DESC
    `;
    
    const [rows] = await bigquery.query(query);
    return rows as Workflow[];
  }

  static async findById(id: string): Promise<Workflow | null> {
    const query = `
      SELECT * FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.workflows_dataset.workflows\`
      WHERE id = @id
    `;
    
    const [rows] = await bigquery.query({
      query,
      params: { id }
    });
    
    return rows[0] as Workflow || null;
  }

  static async update(id: string, updates: Partial<Workflow>): Promise<Workflow | null> {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    // BigQuery لا يدعم UPDATE مباشر، نحتاج MERGE
    const setClause = Object.keys(updateData)
      .map(key => `${key} = @${key}`)
      .join(', ');

    const query = `
      UPDATE \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.workflows_dataset.workflows\`
      SET ${setClause}
      WHERE id = @id
    `;

    await bigquery.query({
      query,
      params: { id, ...updateData }
    });

    return this.findById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const query = `
      DELETE FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.workflows_dataset.workflows\`
      WHERE id = @id
    `;

    const [job] = await bigquery.query({
      query,
      params: { id }
    });

    return true; // BigQuery delete successful
  }

  static async findActive(): Promise<Workflow[]> {
    const query = `
      SELECT * FROM \`${process.env.GOOGLE_CLOUD_PROJECT_ID}.workflows_dataset.workflows\`
      WHERE status = 'active' AND is_active = true
      ORDER BY created_at DESC
    `;
    
    const [rows] = await bigquery.query(query);
    return rows as Workflow[];
  }
}
import pool from '../database/connection';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: any[];
  connections: any[];
  status: 'draft' | 'active' | 'paused' | 'archived';
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  is_active: boolean;
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: Date;
  completed_at?: Date;
  error_message?: string;
  execution_data: any;
}

export class WorkflowModel {
  static async create(workflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'>): Promise<Workflow> {
    const query = `
      INSERT INTO workflows (name, description, nodes, connections, status, created_by, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      workflow.name,
      workflow.description,
      JSON.stringify(workflow.nodes),
      JSON.stringify(workflow.connections),
      workflow.status,
      workflow.created_by,
      workflow.is_active
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(): Promise<Workflow[]> {
    const query = 'SELECT * FROM workflows ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id: string): Promise<Workflow | null> {
    const query = 'SELECT * FROM workflows WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async update(id: string, updates: Partial<Workflow>): Promise<Workflow | null> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const query = `
      UPDATE workflows 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const values = [id, ...Object.values(updates)];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM workflows WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  static async findActive(): Promise<Workflow[]> {
    const query = 'SELECT * FROM workflows WHERE status = $1 AND is_active = true';
    const result = await pool.query(query, ['active']);
    return result.rows;
  }
}
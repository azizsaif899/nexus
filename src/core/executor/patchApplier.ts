import * as fs from 'fs-extra';
import { eventBus } from '../events/eventBus';

export class PatchApplier {
  async applyPatch(filePath: string, patch: string): Promise<void> {
    try {
      const originalContent = await fs.readFile(filePath, 'utf-8');
      const patchedContent = await this.processPatch(originalContent, patch);
      
      await fs.writeFile(filePath, patchedContent, 'utf-8');
      
      eventBus.emit('executor:patch_applied', { file: filePath, success: true });
      
    } catch (error) {
      eventBus.emit('executor:patch_applied', { file: filePath, success: false });
      throw new Error(`Failed to apply patch to ${filePath}: ${(error as Error).message}`);
    }
  }

  private async processPatch(content: string, patch: string): Promise<string> {
    // Check if patch is a complete file replacement
    if (this.isCompleteReplacement(patch)) {
      return patch;
    }
    
    // Check if patch is in unified diff format
    if (this.isUnifiedDiff(patch)) {
      return this.applyUnifiedDiff(content, patch);
    }
    
    // Check if patch is in simple line replacement format
    if (this.isLineReplacement(patch)) {
      return this.applyLineReplacement(content, patch);
    }
    
    // Default: treat as complete replacement
    return patch;
  }

  private isCompleteReplacement(patch: string): boolean {
    // If patch looks like a complete file (has imports, exports, etc.)
    return patch.includes('import ') || patch.includes('export ') || 
           patch.includes('function ') || patch.includes('class ');
  }

  private isUnifiedDiff(patch: string): boolean {
    return patch.includes('@@') && (patch.includes('+++') || patch.includes('---'));
  }

  private isLineReplacement(patch: string): boolean {
    return patch.includes('REPLACE_LINE:') || patch.includes('INSERT_AT:') || patch.includes('DELETE_LINE:');
  }

  private applyUnifiedDiff(content: string, patch: string): string {
    // Basic unified diff application
    // This is a simplified implementation - in production, use a proper diff library
    const lines = content.split('\n');
    const patchLines = patch.split('\n');
    
    let currentLine = 0;
    
    for (const patchLine of patchLines) {
      if (patchLine.startsWith('@@')) {
        // Parse hunk header: @@ -oldStart,oldCount +newStart,newCount @@
        const match = patchLine.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
        if (match) {
          currentLine = parseInt(match[2]) - 1; // Convert to 0-based index
        }
      } else if (patchLine.startsWith('+')) {
        // Add line
        lines.splice(currentLine, 0, patchLine.substring(1));
        currentLine++;
      } else if (patchLine.startsWith('-')) {
        // Remove line
        lines.splice(currentLine, 1);
      } else if (patchLine.startsWith(' ')) {
        // Context line - move to next
        currentLine++;
      }
    }
    
    return lines.join('\n');
  }

  private applyLineReplacement(content: string, patch: string): string {
    const lines = content.split('\n');
    const patchLines = patch.split('\n');
    
    for (const patchLine of patchLines) {
      if (patchLine.startsWith('REPLACE_LINE:')) {
        const [, lineNum, newContent] = patchLine.split(':', 3);
        const lineIndex = parseInt(lineNum) - 1;
        if (lineIndex >= 0 && lineIndex < lines.length) {
          lines[lineIndex] = newContent;
        }
      } else if (patchLine.startsWith('INSERT_AT:')) {
        const [, lineNum, newContent] = patchLine.split(':', 3);
        const lineIndex = parseInt(lineNum) - 1;
        lines.splice(lineIndex, 0, newContent);
      } else if (patchLine.startsWith('DELETE_LINE:')) {
        const [, lineNum] = patchLine.split(':', 2);
        const lineIndex = parseInt(lineNum) - 1;
        if (lineIndex >= 0 && lineIndex < lines.length) {
          lines.splice(lineIndex, 1);
        }
      }
    }
    
    return lines.join('\n');
  }

  async validatePatch(filePath: string, patch: string): Promise<boolean> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      await this.processPatch(content, patch);
      return true;
    } catch (error) {
      return false;
    }
  }

  async previewPatch(filePath: string, patch: string): Promise<{
    original: string[];
    patched: string[];
    changes: Array<{ line: number; type: 'added' | 'removed' | 'modified'; content: string }>;
  }> {
    const originalContent = await fs.readFile(filePath, 'utf-8');
    const patchedContent = await this.processPatch(originalContent, patch);
    
    const originalLines = originalContent.split('\n');
    const patchedLines = patchedContent.split('\n');
    
    const changes: Array<{ line: number; type: 'added' | 'removed' | 'modified'; content: string }> = [];
    
    // Simple diff calculation
    const maxLines = Math.max(originalLines.length, patchedLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const originalLine = originalLines[i];
      const patchedLine = patchedLines[i];
      
      if (originalLine !== patchedLine) {
        if (originalLine === undefined) {
          changes.push({ line: i + 1, type: 'added', content: patchedLine });
        } else if (patchedLine === undefined) {
          changes.push({ line: i + 1, type: 'removed', content: originalLine });
        } else {
          changes.push({ line: i + 1, type: 'modified', content: patchedLine });
        }
      }
    }
    
    return {
      original: originalLines,
      patched: patchedLines,
      changes
    };
  }
}
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs-extra';
import * as path from 'path';

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  // ... other properties from Figma API
}

interface ComponentStructure {
  name: string;
  type: string;
  props: Record<string, any>;
  children: ComponentStructure[];
}

@Injectable()
export class FigmaIntegrationService {
  private readonly figmaApiKey: string;
  private readonly figmaFileId: string;

  constructor(private configService: ConfigService) {
    this.figmaApiKey = this.configService.get<string>('FIGMA_API_KEY');
    this.figmaFileId = this.configService.get<string>('FIGMA_FILE_ID');
  }

  /**
   * Fetches the design data from a Figma file.
   * @returns The raw JSON data from the Figma API.
   */
  async getFigmaFileData(): Promise<any> {
    if (!this.figmaApiKey || !this.figmaFileId) {
      throw new Error('Figma API Key or File ID is not configured.');
    }

    const url = `https://api.figma.com/v1/files/${this.figmaFileId}`;
    const headers = { 'X-Figma-Token': this.figmaApiKey };

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Figma API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Parses a Figma node tree and converts it into a simplified component structure.
   * @param node The Figma node to parse.
   * @returns A simplified structure representing the component.
   */
  private parseFigmaNode(node: FigmaNode): ComponentStructure {
    // This is a simplified parser. A real implementation would be much more complex,
    // handling different node types, styles, auto-layout, etc.
    return {
      name: node.name,
      type: node.type,
      props: {
        // Extract basic properties like dimensions, colors, etc.
        // E.g., width: node.absoluteBoundingBox.width
      },
      children: node.children?.map(child => this.parseFigmaNode(child)) || [],
    };
  }

  /**
   * Generates a React component code from a simplified component structure.
   * @param component The component structure.
   * @returns A string containing the React component code.
   */
  private generateComponentCode(component: ComponentStructure): string {
    const componentName = component.name.replace(/[^a-zA-Z0-9]/g, '');
    const childrenCode = component.children.map(child => this.generateComponentCode(child)).join('\n');
    
    return `import React from 'react';

interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
}

export const ${componentName}: React.FC<${componentName}Props> = ({ 
  className = '',
  children,
  ...props 
}) => {
  return (
    <div 
      className={\`flex-initial \${className}\`}
      {...props}
    >
      {/* Figma Component: ${component.name} - Type: ${component.type} */}
      ${childrenCode}
      {children}
    </div>
  );
};

export default ${componentName};
`;
  }

  /**
   * Saves generated component to file system
   * @param componentName The name of the component
   * @param code The generated code
   * @param targetDir The target directory to save the component
   */
  private async saveComponentToFile(
    componentName: string, 
    code: string, 
    targetDir: string = 'apps/admin-dashboard/src/components/figma'
  ): Promise<void> {
    const projectRoot = process.cwd();
    const fullPath = path.join(projectRoot, targetDir);
    
    // Ensure directory exists
    await fs.ensureDir(fullPath);
    
    // Write component file
    const fileName = `${componentName}.tsx`;
    const filePath = path.join(fullPath, fileName);
    await fs.writeFile(filePath, code, 'utf8');
    
    // Update index file
    const indexPath = path.join(fullPath, 'index.ts');
    const exportLine = `export { default as ${componentName} } from './${componentName}';\n`;
    
    if (await fs.pathExists(indexPath)) {
      const content = await fs.readFile(indexPath, 'utf8');
      if (!content.includes(exportLine.trim())) {
        await fs.appendFile(indexPath, exportLine);
      }
    } else {
      await fs.writeFile(indexPath, exportLine);
    }
  }

  /**
   * Fetches components from Figma and generates React code for them.
   * @param saveToFiles Whether to save components to files
   * @returns An array of objects containing the component name and its generated code.
   */
  async syncComponents(saveToFiles: boolean = true): Promise<{ name: string; code: string; saved?: boolean }[]> {
    const figmaData = await this.getFigmaFileData();
    
    // Find a specific canvas or frame, e.g., the 'Components' page.
    const componentsPage = figmaData.document.children.find(
      (canvas: FigmaNode) => canvas.name === 'Design System'
    );

    if (!componentsPage || !componentsPage.children) {
      throw new Error("Could not find 'Design System' page in the Figma file.");
    }

    // Filter for top-level frames that are marked as components.
    const figmaComponents = componentsPage.children.filter(
      (node: FigmaNode) => node.type === 'COMPONENT'
    );

    const generatedComponents = await Promise.all(
      figmaComponents.map(async (componentNode: FigmaNode) => {
        const simplifiedStructure = this.parseFigmaNode(componentNode);
        const componentCode = this.generateComponentCode(simplifiedStructure);
        const componentName = simplifiedStructure.name.replace(/[^a-zA-Z0-9]/g, '');
        
        let saved = false;
        if (saveToFiles) {
          try {
            await this.saveComponentToFile(componentName, componentCode);
            saved = true;
          } catch (error) {
            console.error(`Failed to save component ${componentName}:`, error);
          }
        }
        
        return {
          name: componentName,
          code: componentCode,
          saved,
        };
      })
    );

    return generatedComponents;
  }
}

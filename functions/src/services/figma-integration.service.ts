import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
    // This is a simplified code generator. A real implementation would use a templating engine
    // and handle props, styles (e.g., converting to Tailwind CSS), and children recursively.
    const componentName = component.name.replace(/\s+/g, '');
    const childrenCode = component.children.map(child => this.generateComponentCode(child)).join('\n');

    return `
const ${componentName} = () => {
  return (
    <div className="flex-initial">
      {/* Component: ${component.name} - Type: ${component.type} */}
      ${childrenCode}
    </div>
  );
};
`;
  }

  /**
   * Fetches components from Figma and generates React code for them.
   * @returns An array of objects containing the component name and its generated code.
   */
  async syncComponents(): Promise<{ name: string; code: string }[]> {
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

    const generatedComponents = figmaComponents.map((componentNode: FigmaNode) => {
      const simplifiedStructure = this.parseFigmaNode(componentNode);
      const componentCode = this.generateComponentCode(simplifiedStructure);
      return {
        name: simplifiedStructure.name.replace(/\s+/g, ''),
        code: componentCode,
      };
    });

    return generatedComponents;
  }
}

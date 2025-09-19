# 🎨 Figma API Integration Guide

This document outlines the process of integrating Figma designs directly into the FlowCanvasAI project using the Figma API. This allows for automated generation and synchronization of React components from Figma components.

## 🎯 **Goal**

To create a seamless workflow where Figma is the single source of truth for design, and code components are automatically generated or updated based on changes in the Figma file.

## 🔑 **Prerequisites**

1.  **Figma API Key:** You need a "Personal Access Token" from your Figma account.
    *   Go to `Account Settings` > `Personal access tokens`.
    *   Create a new token. **Copy it immediately**, as you won't be able to see it again.

2.  **Figma File ID:** This is the unique identifier for your Figma design file. You can find it in the URL of your Figma file:
    *   `https://www.figma.com/file/{FILE_ID}/Your-File-Name`

## ⚙️ **How It Works**

The integration is handled by a dedicated service in the backend (`FigmaIntegrationService`).

1.  **API Endpoint:** A request is sent to the `POST /api/figma/sync-components` endpoint in our backend.
2.  **Figma API Call:** The `FigmaIntegrationService` uses the configured API Key and File ID to fetch the entire structure of the Figma file as a JSON object.
3.  **JSON Parsing:** The service then parses this large JSON object, looking for a specific page named **"Design System"**. Inside this page, it identifies all top-level elements marked as **Components**.
4.  **Structure Transformation:** Each Figma component node is transformed from the complex Figma format into a simplified, abstract structure that represents a React component (e.g., its name, children, and basic properties).
5.  **Code Generation:** This abstract structure is then passed to a code generator, which creates the corresponding React component code (JSX) as a string.
6.  **File Creation (Next Step):** The generated code string is then ready to be written into a `.tsx` file within the project's component library (e.g., `packages/shared-ui/src/components/generated/`).

## 🚀 **Workflow for Designers & Developers**

1.  **Designer:** Creates or updates a component in the **"Design-System"** page in the main Figma file.
2.  **Developer:** Runs a command or clicks a button in the app's admin dashboard that triggers the `sync-components` API endpoint.
3.  **Automation:** The backend service fetches the changes, generates the new component code, and saves it as a file in the project.
4.  **Developer:** Reviews the newly generated component and integrates it into the application.

## 🔧 **Configuration**

To enable this feature, you must add the following variables to your environment configuration (e.g., a `.env` file):

```
FIGMA_API_KEY="your_personal_access_token_here"
FIGMA_FILE_ID="your_figma_file_id_here"
```

## ⚠️ **Current Status & Limitations**

-   The current implementation is a **Proof of Concept**.
-   The parser and code generator are highly simplified. They can identify components but do not yet translate complex styles (like Auto Layout) into accurate Tailwind CSS classes.
-   The service returns the generated code in the API response. The final step of writing the code to files on the server's filesystem is not yet implemented.

This setup provides a powerful foundation for a fully automated design-to-code pipeline.

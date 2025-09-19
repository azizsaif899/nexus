# 🎨 Figma API Integration Guide - دليل تكامل واجهة Figma

This document outlines the process of integrating Figma designs directly into the FlowCanvasAI project using the Figma API. This allows for automated generation and synchronization of React components from Figma components.

## 🎯 **Goal**

To create a seamless **one-way workflow** where Figma is the **single source of truth for design**, and code components are automatically generated or updated based on changes in the Figma file.

## 🔑 **Prerequisites**

1.  **Figma API Key:** You need a "Personal Access Token" from your Figma account.
    *   Go to `Account Settings` > `Personal access tokens`.
    *   Create a new token. **Copy it immediately**, as you won't be able to see it again.

2.  **Figma File ID:** This is the unique identifier for your Figma design file. You can find it in the URL of your Figma file:
    *   `https://www.figma.com/file/{FILE_ID}/Your-File-Name`

## ⚙️ **How It Works (One-Way Sync)**

The integration is designed as a one-way data flow: **from Figma to Code**. Changes made directly to the code will **NOT** be synced back to Figma. This ensures design consistency.

1.  **Design in Figma:** The designer creates or updates components in the main Figma file.
2.  **Trigger Sync:** A developer triggers the sync process via an API endpoint (`POST /api/figma/sync-components`).
3.  **Fetch from Figma API:** The backend service uses the API Key and File ID to **read** the structure of the Figma file as a JSON object.
4.  **Parse & Transform:** The service parses the JSON, looking for components, and transforms their properties into a simplified structure.
5.  **Generate Code:** This structure is used to generate the corresponding React component code (JSX) as a string.
6.  **Write to Files (Next Step):** The generated code is then ready to be written into `.tsx` files in the project's component library.

## 🚀 **Workflow for Designers & Developers**

1.  **Designer:** Creates or updates a component in the **"Design-System"** page in the main Figma file. This is the single source of truth.
2.  **Developer:** Runs a command or clicks a button to trigger the `sync-components` API endpoint.
3.  **Automation:** The backend service fetches the changes, generates the new component code, and saves it as a file.
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
-   The final step of automatically writing the code to files on the server's filesystem is not yet implemented.
-   **The integration is strictly one-way (Figma to Code).** Manual code changes to synced components will be overwritten on the next sync.

This setup provides a powerful foundation for a fully automated design-to-code pipeline, ensuring that the application's UI always reflects the master design in Figma.

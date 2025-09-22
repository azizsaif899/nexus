import { PageHeader } from "@/components/app/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function getFigmaFile() {
  const fileKey = process.env.FIGMA_FILE_KEY;
  const token = process.env.FIGMA_API_TOKEN;

  if (!fileKey || !token) {
    throw new Error("Figma API token or file key is not set in environment variables.");
  }

  try {
    const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        "X-Figma-Token": token,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Figma file: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function FigmaPage() {
  const figmaFile = await getFigmaFile();

  return (
    <>
      <PageHeader
        title="Figma Design Viewer"
        description="View data from your Figma design file."
      />
      <Card>
        <CardHeader>
          <CardTitle>Figma File Data</CardTitle>
          <CardDescription>
            Below is the raw JSON data fetched from the Figma API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {figmaFile ? (
            <pre className="p-4 bg-muted rounded-lg overflow-auto max-h-[600px]">
              {JSON.stringify(figmaFile, null, 2)}
            </pre>
          ) : (
            <p className="text-destructive">
              Failed to load Figma file. Please check the server logs for more details.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}

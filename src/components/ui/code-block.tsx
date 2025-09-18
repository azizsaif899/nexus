
'use client';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'json' }: CodeBlockProps) {
  return (
    <pre className="mt-2 rounded-md bg-muted p-4 text-sm">
      <code className={`language-${language} text-muted-foreground`}>
        {code}
      </code>
    </pre>
  );
}

export default CodeBlock;

"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { generateApiKey } from "./actions";

export default function ApiKeyCard({
  initialKey,
}: {
  initialKey: string | null;
}) {
  const [apiKey, setApiKey] = useState(initialKey);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      const key = await generateApiKey();
      setApiKey(key);
      setCopied(false);
    });
  };

  const handleCopy = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Extension API key</CardTitle>
        <CardDescription>
          Paste this into the Handy browser extension so it knows which account
          to save jobs to.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {apiKey ? (
          <div className="flex gap-2">
            <Input readOnly value={apiKey} className="font-mono" />
            <Button type="button" variant="outline" onClick={handleCopy}>
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No key yet — generate one below.
          </p>
        )}

        <Button type="button" onClick={handleGenerate} disabled={isPending}>
          {isPending
            ? "Generating..."
            : apiKey
              ? "Regenerate key"
              : "Generate key"}
        </Button>

        {apiKey && (
          <p className="text-xs text-muted-foreground">
            Regenerating creates a new key and immediately invalidates the old
            one — you&apos;ll need to update the extension too.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

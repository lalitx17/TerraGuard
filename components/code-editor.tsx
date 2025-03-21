"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import type { editor } from "monaco-editor";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CodeEditorProps {
  initialValue?: string;
  language?: string;
  height?: string;
  onSave?: (value: string) => void;
  readOnly?: boolean;
  highlightResource?: string | null;
}

export function CodeEditor({
  initialValue = "",
  language = "terraform",
  height = "70vh",
  onSave,
  readOnly = false,
}: CodeEditorProps) {
  const { toast } = useToast();
  const [value, setValue] = useState(initialValue);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isLoading, setIsLoading] = useState(true);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    editorRef.current = editor;
    setIsLoading(false);

    // Configure Monaco editor
    monaco.editor.defineTheme("terraformTheme", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#FAFAFA",
        "editor.lineHighlightBackground": "#F0F0F0",
        "editorLineNumber.foreground": "#999999",
        "editorCursor.foreground": "#666666",
        "editor.selectionBackground": "#B3D7FF",
      },
    });

    monaco.editor.setTheme("terraformTheme");

    // Set editor options
    editor.updateOptions({
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: "on",
      readOnly: readOnly,
      wordWrap: "on",
      automaticLayout: false, // Disable automatic layout to prevent ResizeObserver loops
      scrollbar: {
        verticalScrollbarSize: 12,
        horizontalScrollbarSize: 12,
      },
      lineHeight: 22,
      padding: {
        top: 10,
        bottom: 10,
      },
      glyphMargin: true,
      folding: true,
      renderLineHighlight: "all",
    });

    // Focus the editor
    editor.focus();

    // Set up keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) {
        onSave(editor.getValue());
      }
    });

    // Handle initial layout
    setTimeout(() => {
      editor.layout();
    }, 100);
  };

  // Handle resize with debouncing
  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    }, 100);
  }, []);

  // Set up resize observer
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const handleSave = () => {
    if (onSave && editorRef.current) {
      const currentValue = editorRef.current.getValue();
      onSave(currentValue);
      toast({
        title: "Changes saved",
        description: "Your configuration has been updated successfully.",
      });
    }
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
  };

  const handleFormatDocument = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument")?.run();
      toast({
        title: "Document formatted",
        description: "Your code has been formatted.",
      });
    }
  };

  // Handle Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 bg-muted/40 border-b">
        <div className="flex items-center gap-2">
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="terraform">Terraform</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="yaml">YAML</SelectItem>
              <SelectItem value="hcl">HCL</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFormatDocument}
            disabled={isLoading || readOnly}
          >
            Format
          </Button>
        </div>
        <Button size="sm" onClick={handleSave} disabled={isLoading || readOnly}>
          Save
        </Button>
      </div>

      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden"
        style={{ height }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <Editor
          height="100%"
          language={selectedLanguage}
          value={initialValue}
          onChange={(value) => setValue(value || "")}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
          }}
          className="border-0"
        />
      </div>
    </div>
  );
}

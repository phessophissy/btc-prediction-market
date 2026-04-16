import { useEffect } from "react";

interface ShortcutMap {
  [combo: string]: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const parts: string[] = [];
      if (e.ctrlKey || e.metaKey) parts.push("mod");
      if (e.shiftKey) parts.push("shift");
      if (e.altKey) parts.push("alt");
      parts.push(e.key.toLowerCase());

      const combo = parts.join("+");

      if (shortcuts[combo]) {
        e.preventDefault();
        shortcuts[combo]();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
}

import { useState } from "react";
import { toast } from "react-hot-toast";

export function useClipboard({ timeout = 2000 } = {}) {
  const [error, setError] = useState<Error | null>(null);
  const [copied, setCopied] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [copyTimeout, setCopyTimeout] = useState<any>(null);

  const handleCopyResult = (value: boolean) => {
    clearTimeout(copyTimeout);
    setCopyTimeout(setTimeout(() => setCopied(false), timeout));
    setCopied(value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const copy = (valueToCopy: any) => {
    if ("clipboard" in navigator) {
      navigator.clipboard
        .writeText(valueToCopy)
        .then(() => handleCopyResult(true))
        .catch((err) => setError(err));
    } else {
      setError(new Error("useClipboard: navigator.clipboard is not supported"));
    }
  };

  const reset = () => {
    setCopied(false);
    setError(null);
    clearTimeout(copyTimeout);
  };

  return { copy, reset, error, copied };
}

export function useCopyToClipboard() {
  const clipboard = useClipboard();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const copy = (value: any) => {
    if (!value) return;
    clipboard.copy(value);
    toast.success(`Successfully copied to clipboard!`);
  };

  return copy;
}

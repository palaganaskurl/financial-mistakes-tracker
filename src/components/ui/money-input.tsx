import type {
  ChangeEvent,
  ComponentProps,
  FocusEvent,
  MutableRefObject,
  Ref,
} from "react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

type MoneyInputProps = Omit<
  ComponentProps<"input">,
  "type" | "value" | "onChange" | "inputMode"
> & {
  value?: number | null;
  onValueChange?: (value: number) => void;
};

function cleanMoneyValue(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [whole = "", ...decimalParts] = cleaned.split(".");
  const decimal = decimalParts.join("").slice(0, 2);
  const normalizedWhole = whole.replace(/^0+(?=\d)/, "");

  if (cleaned.includes(".")) {
    return `${normalizedWhole || "0"}.${decimal}`;
  }

  return normalizedWhole;
}

function formatMoneyValue(value: string) {
  if (!value) return "";

  const [whole = "", decimal] = value.split(".");
  const formattedWhole = whole ? Number(whole).toLocaleString("en-US") : "";

  if (value.includes(".")) {
    return `${formattedWhole || "0"}.${decimal ?? ""}`;
  }

  return formattedWhole;
}

function getDisplayValue(value?: number | null) {
  if (!value) return "";

  return formatMoneyValue(String(value));
}

function setInputRefs(
  node: HTMLInputElement | null,
  internalRef: MutableRefObject<HTMLInputElement | null>,
  forwardedRef: Ref<HTMLInputElement> | undefined,
) {
  internalRef.current = node;

  if (typeof forwardedRef === "function") {
    forwardedRef(node);
    return;
  }

  if (forwardedRef) {
    forwardedRef.current = node;
  }
}

function MoneyInput({
  value,
  onValueChange,
  onBlur,
  ref,
  placeholder = "0",
  ...props
}: MoneyInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [displayValue, setDisplayValue] = useState(() =>
    getDisplayValue(value),
  );

  useEffect(() => {
    if (document.activeElement === inputRef.current) return;

    setDisplayValue(getDisplayValue(value));
  }, [value]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const moneyValue = cleanMoneyValue(event.currentTarget.value);
    const nextDisplayValue = formatMoneyValue(moneyValue);
    const numericValue = Number(moneyValue);

    setDisplayValue(nextDisplayValue);
    onValueChange?.(
      moneyValue && Number.isFinite(numericValue) ? numericValue : 0,
    );
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    const moneyValue = cleanMoneyValue(event.currentTarget.value).replace(
      /\.$/,
      "",
    );
    const numericValue = Number(moneyValue);

    setDisplayValue(formatMoneyValue(moneyValue));
    onValueChange?.(
      moneyValue && Number.isFinite(numericValue) ? numericValue : 0,
    );
    onBlur?.(event);
  }

  return (
    <Input
      {...props}
      ref={(node) => setInputRefs(node, inputRef, ref)}
      type="text"
      inputMode="decimal"
      pattern="[0-9,.]*"
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}

export { MoneyInput };

"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { CATEGORY_ICON_KEYS, getCategoryIcon } from "@/components/icons/categoryIcons";

type IconPickerProps = {
  value?: string;
  onChange: (key: string) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const SelectedIcon = getCategoryIcon(value);

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return CATEGORY_ICON_KEYS;
    }
    return CATEGORY_ICON_KEYS.filter((key) => key.includes(trimmed));
  }, [query]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50">
        <SelectedIcon className="h-5 w-5 text-neutral-700" aria-hidden />
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Choose icon
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Choose an icon">
        <div className="space-y-4">
          <Input
            label="Search icons"
            placeholder="Search icon"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="max-h-72 overflow-y-auto">
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
              {filtered.map((key) => {
                const Icon = getCategoryIcon(key);
                const isSelected = value === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onChange(key);
                      setOpen(false);
                    }}
                    className={`flex h-12 w-12 items-center justify-center rounded-lg border text-neutral-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-100"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                    aria-label={`Select ${key} icon`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

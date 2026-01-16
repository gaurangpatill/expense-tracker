"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Card } from "@/components/ui/card";
import { getCategoryIcon } from "@/components/icons/categoryIcons";
import { IconPicker } from "@/components/categories/IconPicker";
import { categorySchema } from "@/server/validators/category";

const schema = categorySchema;

type CategoryForm = z.infer<typeof schema>;

type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<CategoryForm>({
    resolver: zodResolver(schema),
    defaultValues: { color: "#0ea5e9" },
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    formState: { errors: editErrors, isSubmitting: editSubmitting },
    reset: resetEdit,
    control: editControl,
  } = useForm<CategoryForm>({
    resolver: zodResolver(schema),
  });

  async function fetchCategories() {
    setLoading(true);
    const response = await fetch("/api/categories");
    if (response.ok) {
      const data = await response.json();
      setCategories(data.items);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      toast.error(payload?.error ?? "Unable to create category");
      return;
    }

    toast.success("Category added");
    reset({ name: "", icon: "", color: values.color });
    fetchCategories();
  });

  const onDelete = async (id: string) => {
    const response = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      toast.error(payload?.error ?? "Unable to delete category");
      return;
    }
    toast.success("Category removed");
    fetchCategories();
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    resetEdit({ name: category.name, color: category.color, icon: category.icon });
  };

  const onUpdate = handleEditSubmit(async (values) => {
    if (!editing) return;
    const response = await fetch(`/api/categories/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      toast.error(payload?.error ?? "Unable to update category");
      return;
    }

    toast.success("Category updated");
    setEditing(null);
    fetchCategories();
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
      <Card>
        <h2 className="text-lg font-semibold">Add category</h2>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input label="Name" placeholder="Groceries" error={errors.name?.message} {...register("name")} />
          <Input label="Color" type="color" error={errors.color?.message} {...register("color")} />
          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <div className="space-y-2">
                <span className="text-sm font-medium text-neutral-700">Icon</span>
                <IconPicker value={field.value} onChange={field.onChange} />
                {errors.icon?.message ? (
                  <span className="text-xs text-red-600">{errors.icon?.message}</span>
                ) : null}
              </div>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create category"}
          </Button>
        </form>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your categories</h2>
          <span className="text-xs text-neutral-500">{categories.length} total</span>
        </div>
        {loading ? (
          <p className="mt-6 text-sm text-neutral-500">Loading categories...</p>
        ) : (
          <div className="mt-6 space-y-3">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.icon);
              return (
                <div key={category.id} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <Icon className="h-4 w-4 text-neutral-700" data-testid={`category-icon-${category.id}`} aria-hidden />
                    <div>
                      <p className="text-sm font-semibold">{category.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="secondary" onClick={() => openEdit(category)}>
                      Edit
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => onDelete(category.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit category">
        <form className="space-y-4" onSubmit={onUpdate}>
          <Input label="Name" error={editErrors.name?.message} {...registerEdit("name")} />
          <Input label="Color" type="color" error={editErrors.color?.message} {...registerEdit("color")} />
          <Controller
            control={editControl}
            name="icon"
            render={({ field }) => (
              <div className="space-y-2">
                <span className="text-sm font-medium text-neutral-700">Icon</span>
                <IconPicker value={field.value} onChange={field.onChange} />
                {editErrors.icon?.message ? (
                  <span className="text-xs text-red-600">{editErrors.icon?.message}</span>
                ) : null}
              </div>
            )}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={editSubmitting}>
              {editSubmitting ? "Updating..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

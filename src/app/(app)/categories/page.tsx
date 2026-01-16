import { CategoryManager } from "@/components/categories/category-manager";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-sm text-neutral-500">Customize how you group your spending.</p>
      </div>
      <CategoryManager />
    </div>
  );
}

"use client";

import { redirect } from "next/navigation";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { categoryFields } from "../../../../components/agGrids/dataFields/recognitionCategoryFields";
import AdminHeader from "@/components/AdminHeader";
import { useState, useEffect } from "react";

export default function RecognitionCategoriesPage() {
  const [categories, setCategories] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/bigup");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error) return <div>Failed to load categories.</div>;
  if (isLoading) return <div>Loading categories...</div>;

  const categoryData = categories?.resource || [];
  const categoryCount = categoryData.length;

  return (
    <>
      <AdminHeader headingText={"Recognition Categories"} dataCount={categoryCount} />
      <DataGridComponent
        data={categoryData}
        initialFields={categoryFields}
        createNewUrl={"/bigup-categories/create"}
      />
    </>
  );
}

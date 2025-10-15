import React from "react";
import AdminLayout from "../../../components/layouts/AdminLayout";
import { PageHeader } from "../../../components/admin";
import ProductForm from "../../../components/admin/product/ProductForm";
const AddProductPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <PageHeader title="Add Product" description="Add a new product" />
      </div>
      <ProductForm />
    </AdminLayout>
  );
};

export default AddProductPage;

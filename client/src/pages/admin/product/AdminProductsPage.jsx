import React from "react";
import { PageHeader } from "../../../components/admin";
import { Button } from "../../../components/ui";
import { Plus } from "lucide-react";
import ProductList from "../../../components/admin/product/ProductList";
import AdminLayout from "../../../components/layouts/AdminLayout";
import { Link } from "react-router-dom";
const AdminProductsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Page Header */}
        <PageHeader
          title="Products"
          description="Manage your product inventory"
        >
          <PageHeader.Right>
            <Button asChild>
              <Link to="/admin/product/add">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </PageHeader.Right>
        </PageHeader>

        {/* Product List */}
        <div>
          <ProductList />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProductsPage;

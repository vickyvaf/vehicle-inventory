import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, deleteProduct } from "@/services/api";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";

export const Route = createFileRoute("/")({
  component: ProductsIndexRoute,
});

function ProductsIndexRoute() {
  const [searchBrand, setSearchBrand] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", debouncedSearch],
    queryFn: () => getProducts(debouncedSearch),
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const [selectedProductBrand, setSelectedProductBrand] = useState<string>("");

  const handleDelete = (id: number, brand: string) => {
    setSelectedProductId(id);
    setSelectedProductBrand(brand);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProductId !== null) {
      deleteMutation.mutate(selectedProductId, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSelectedProductId(null);
          setSelectedProductBrand("");
        },
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(searchBrand);
  };

  return (
    <div className="p-8 pb-20 sm:p-20 text-left">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Vehicle Inventory</h1>
      </div>

      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="max-w-sm w-full">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search by Brand..."
              value={searchBrand}
              onChange={(e) => setSearchBrand(e.target.value)}
            />
            <button
              type="submit"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md font-medium text-sm transition-colors"
            >
              Search
            </button>
          </form>
        </div>
        <Link
          to="/products/create"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm transition-colors whitespace-nowrap"
        >
          Create Product
        </Link>
      </div>

      <div className="rounded-md border mx-auto w-full overflow-hidden bg-card text-card-foreground shadow-sm">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium">
                ID
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                Brand
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                Type
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-right">
                Stock
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-right">
                Price
              </th>
              <th scope="col" className="px-6 py-4 font-medium">
                Description
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  Loading inventory...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-destructive"
                >
                  Failed to load inventory.
                </td>
              </tr>
            ) : data?.data && data.data.length > 0 ? (
              data.data.map((product) => (
                <tr
                  key={product.id}
                  className="bg-card border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{product.id}</td>
                  <td className="px-6 py-4 font-semibold">{product.brand}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold select-none">
                      {product.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${product.stock > 0 ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-red-50 text-red-700 ring-red-600/10"}`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(product.price)}
                  </td>
                  <td
                    className="px-6 py-4 max-w-xs truncate"
                    title={product.description}
                  >
                    {product.description}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-2">
                      <Link
                        to="/products/$id/edit"
                        params={{ id: product.id.toString() }}
                        className="inline-flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.brand)}
                        disabled={deleteMutation.isPending}
                        className="cursor-pointer inline-flex items-center gap-1.5 bg-destructive text-destructive-foreground hover:bg-destructive/90 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {deleteMutation.isPending ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        title={`Delete Product ${selectedProductBrand}`}
        description={`Are you sure you want to delete ${selectedProductBrand}? This action cannot be undone and the data will be permanently removed from our servers.`}
      />
    </div>
  );
}

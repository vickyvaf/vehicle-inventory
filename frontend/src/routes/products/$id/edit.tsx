import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProductById, updateProduct } from '@/services/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'

export const Route = createFileRoute('/products/$id/edit')({
  component: ProductsEditRoute,
})

const productSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  type: z.string().min(1, 'Type is required'),
  stock: z.number().min(0, 'Stock must be non-negative'),
  price: z.number().min(0, 'Price must be non-negative'),
  description: z.string(),
})

type ProductFormValues = z.infer<typeof productSchema>

function ProductsEditRoute() {
  const { id } = Route.useParams()
  const productId = Number(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['products', productId],
    queryFn: () => getProductById(productId),
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      brand: '',
      type: '',
      stock: 0,
      price: 0,
      description: '',
    }
  })

  useEffect(() => {
    if (product) {
      reset({
        brand: product.brand,
        type: product.type,
        stock: product.stock,
        price: product.price,
        description: product.description || '',
      })
    }
  }, [product, reset])

  const mutation = useMutation({
    mutationFn: (data: ProductFormValues) => updateProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['products', productId] })
      navigate({ to: '/' })
    },
  })

  const onSubmit = (data: ProductFormValues) => {
    mutation.mutate(data)
  }

  if (isLoading) {
    return <div className="p-20 text-center text-muted-foreground">Loading product data...</div>
  }

  if (isError || !product) {
    return (
      <div className="p-20 text-center">
        <p className="text-destructive font-medium mb-4">Failed to load product details.</p>
        <button
          onClick={() => navigate({ to: '/' })}
          className="text-muted-foreground hover:text-foreground underline underline-offset-4 text-sm font-medium"
        >
          Return to Inventory
        </button>
      </div>
    )
  }

  return (
    <div className="p-8 pb-20 sm:p-20">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
              ID: {product.id}
            </span>
          </div>
          <button
            onClick={() => navigate({ to: '/' })}
            className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline text-sm font-medium"
          >
            Back to Inventory
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card text-card-foreground border rounded-lg p-6 shadow-sm">
          
          <div className="space-y-2">
            <label htmlFor="brand" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Brand
            </label>
            <input
              id="brand"
              {...register('brand')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.brand && <p className="text-[0.8rem] font-medium text-destructive">{errors.brand.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Type
            </label>
            <input
              id="type"
              {...register('type')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.type && <p className="text-[0.8rem] font-medium text-destructive">{errors.type.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="stock" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Stock
              </label>
              <input
                id="stock"
                type="number"
                {...register('stock', { valueAsNumber: true })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.stock && <p className="text-[0.8rem] font-medium text-destructive">{errors.stock.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Price (IDR)
              </label>
              <input
                id="price"
                type="number"
                {...register('price', { valueAsNumber: true })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {errors.price && <p className="text-[0.8rem] font-medium text-destructive">{errors.price.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.description && <p className="text-[0.8rem] font-medium text-destructive">{errors.description.message}</p>}
          </div>
          
          <div className="flex justify-end pt-4 border-t gap-2">
            <button
              type="button"
              onClick={() => navigate({ to: '/' })}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
            >
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {mutation.isError && (
             <div className="p-3 text-sm rounded-md bg-destructive/15 text-destructive font-medium mt-4">
               Failed to update product. Please check the backend connection.
             </div>
          )}
        </form>
      </div>
    </div>
  )
}

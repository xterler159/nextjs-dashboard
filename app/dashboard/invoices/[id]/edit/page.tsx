import Breadcrumbs from "@/app/ui/invoices/breadcrumbs"
import { fetchInvoiceById, fetchCustomers } from "@/app/lib/data"
import Form from "@/app/ui/invoices/create-form"
import EditInvoiceForm from "@/app/ui/invoices/edit-form"

export type EditProps = {
  params: Promise<{ id: string }>
}

const Edit = async ({ params }: EditProps) => {
  const id = (await params).id
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers()
  ])

  return (
    <main>
      <Breadcrumbs breadcrumbs={[
        { label: 'Invoices', href: '/dashboard/invoices' },
        {
          label: 'Edit Invoice',
          href: `/dashboard/invoices/${id}/edit`,
          active: true,
        },
      ]} />
      
      <EditInvoiceForm invoice={invoice} customers={customers} />
    </main>
  )
}

export default Edit
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import Pagination from "@/app/ui/invoices/pagination";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import Table from "@/app/ui/invoices/table";
import { fetchInvoicesPages } from "@/app/lib/data";

export type SearchParamsType = {
  query?: string;
  page?: string;
};

export type InvoicesProps = {
  searchParams: Promise<SearchParamsType>;
};

const Invoices = async ({ searchParams }: InvoicesProps) => {
  const { page, query } = await searchParams;
  const searchQuery = query || "";

  const currentPage = Number(page) || 1;
  const totalPages = await fetchInvoicesPages(searchQuery);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>

      <Suspense fallback={<InvoicesTableSkeleton />} key={searchQuery + currentPage}>
        <Table query={searchQuery} currentPage={currentPage} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
};

export default Invoices;

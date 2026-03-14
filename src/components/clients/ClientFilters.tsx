"use client";

import Link from "next/link";
import { clientStatusEnum, clientTypeEnum } from "@/lib/validations/client";

type Props = {
  search?: string;
  type?: string;
  status?: string;
};

export function ClientFilters({ search = "", type, status }: Props) {
  return (
    <form method="get" className="flex flex-wrap items-center gap-3">
      <input
        name="search"
        defaultValue={search}
        placeholder="Search by ID, name, or email"
        className="flex-1 min-w-[200px] rounded-full border border-slate-300 px-4 py-2 text-sm placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />

      <select
        name="type"
        defaultValue={type ?? ""}
        className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      >
        <option value="">All types</option>
        {clientTypeEnum.options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>

      <select
        name="status"
        defaultValue={status ?? ""}
        className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      >
        <option value="">All statuses</option>
        {clientStatusEnum.options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Apply
      </button>
      <Link
        href="/clients"
        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
      >
        Clear
      </Link>
    </form>
  );
}

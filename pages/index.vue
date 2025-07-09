<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Prijava } from "@/generated/prisma";

const { data: prijave, pending } = await useFetch<Prijava[]>("/api/prijave");

const columns: TableColumn<Prijava>[] = [
  { accessorKey: "imePriimek", header: "Ime in priimek" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "telefon", header: "Telefon" },
  {
    accessorKey: "datumRojstva",
    header: "Datum rojstva",
    cell: ({ row }) => {
      return new Date(row.original.datumRojstva).toLocaleDateString("sl-SI");
    },
  },
  { accessorKey: "izkusenost", header: "Izkušenost" },
];
</script>
<template>
  <UContainer>
    <div class="flex flex-col gap-3 my-10">
      <h2 class="text-2xl font-bold text-center">Prijave 🏸</h2>
      <UTable :columns="columns" :data="prijave ?? []" :loading="pending" />
    </div>
  </UContainer>
</template>

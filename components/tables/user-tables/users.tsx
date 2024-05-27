'use client';
import { Button } from '@/components/ui/button';
// import { DataTable } from "@/components/ui/data-table";
import { Heading } from '@/components/ui/heading';
// import { Separator } from "@/components/ui/separator";
// import { User } from "@/constants/data";
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { columns } from "./columns";

interface UsersTableProps {
  data?: any[];
}

export const UsersTable: React.FC<UsersTableProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`کاربران (${data?.length || 0})`}
          description="مدیریت کاربران"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/users/create`)}
        >
          <Plus className="ml-2 h-4 w-4" /> افزودن کاربر
        </Button>
      </div>
      {/* <Separator />
      <DataTable searchKey="name" columns={columns} data={data} /> */}
    </>
  );
};

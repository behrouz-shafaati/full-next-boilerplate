import { DataTable } from '@/components/ui/data-table';
// import { DataTable } from "@/components/ui/data-table";
import { Heading } from '@/components/ui/heading';
import { LinkButton } from '@/components/ui/link-button';
import userCtrl from '@/lib/entity/user/controller';
import { User } from '@/lib/entity/user/interface';
// import { Separator } from "@/components/ui/separator";
// import { User } from "@/constants/data";
import { Plus, Trash } from 'lucide-react';
import { columns } from './columns';
import { QueryResponse } from '@/lib/entity/core/interface';
import { Role } from '@/lib/entity/role/interface';
import roleCtrl from '@/lib/entity/role/controller';
import GroupAction from './group-action';

interface UsersTableProps {
  query: string;
  currentPage: number;
}

export default async function UsersTable({
  query,
  currentPage,
}: UsersTableProps) {
  const roles: Role[] = roleCtrl.getRoles();

  const findResult: QueryResponse<User> = await userCtrl.find({
    filters: { query },
    pagination: { page: currentPage, perPage: 6 },
  });

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`کاربران (${findResult?.totalDocuments || 0})`}
          description="مدیریت کاربران"
        />
        <LinkButton
          className="text-xs md:text-sm"
          href="/dashboard/users/create"
        >
          <Plus className="ml-2 h-4 w-4" /> افزودن کاربر
        </LinkButton>
      </div>
      <DataTable
        searchTitle="جستجو ..."
        columns={columns}
        response={findResult}
        groupAction={GroupAction}
      />
    </>
  );
}

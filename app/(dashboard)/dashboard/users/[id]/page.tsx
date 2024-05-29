import { UserForm } from '@/components/forms/user-form';
import { BreadCrumb } from '@/components/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import userCtrl from '@/lib/entity/user/controller';
import { notFound } from 'next/navigation';

type PageProps = {
  params?: { id: string };
};
export default async function Page({ params }: { params: { id: string } }) {
  let user = null;
  let pageBreadCrumb = { title: 'افزودن', link: '/dashboard/users/create' };
  if (params.id !== 'create') {
    const id = params.id;
    [user] = await Promise.all([userCtrl.findById({ id })]);
    if (!user) {
      notFound();
    }
    pageBreadCrumb = {
      title: user.name,
      link: `/dashboard/users/${params.id}`,
    };
  }

  const breadcrumbItems = [
    { title: 'کاربران', link: '/dashboard/users' },
    pageBreadCrumb,
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <UserForm initialData={user} />
      </div>
    </ScrollArea>
  );
}

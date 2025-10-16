'use client';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

type GroupActionProps = {
  items: any[];
};
export default function GroupAction({ items }: GroupActionProps) {
  return (
    <div>
      <Button
        variant="outline"
        className="text-xs"
        onClick={() => console.log('#298 items:', items)}
      >
        <Trash className="ml-2 h-4 w-4 " /> حذف گروهی
      </Button>
    </div>
  );
}

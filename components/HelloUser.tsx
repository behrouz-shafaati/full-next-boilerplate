'use client';
import { useSession } from './context/SessionContext';
import { Button } from './ui/button';

export default function HelloUser() {
  const { user } = useSession();
  return (
    <div>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          سلام {user?.name} 👋
        </h2>
        <div className="hidden md:flex items-center space-x-2">
          <Button>Download</Button>
        </div>
      </div>
    </div>
  );
}

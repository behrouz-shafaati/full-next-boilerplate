import { Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ModalProps = {
  title: string;
  content: any;
  isOpen: boolean;
  onCloseModal: () => void;
  description?: string;
};
export default function Modal({
  title,
  content,
  isOpen,
  onCloseModal,
  description = '',
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCloseModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

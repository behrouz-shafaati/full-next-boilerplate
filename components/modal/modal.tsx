import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

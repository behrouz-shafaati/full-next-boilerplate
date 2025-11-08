import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ModalProps = {
  title: string
  content: any
  isOpen: boolean
  onCloseModal: () => void
  description?: string
  size?: 'small' | 'medium' | 'large' | 'full'
}
export default function Modal({
  title,
  content,
  isOpen,
  onCloseModal,
  description = '',
  size = 'medium',
}: ModalProps) {
  let sizeClass
  switch (size) {
    case 'small':
      sizeClass = 'max-w-md'
      break
    case 'medium':
      sizeClass = 'max-w-3xl'
      break
    case 'large':
      sizeClass = 'max-w-7xl'
      break
    case 'full':
      sizeClass = 'max-w-full'
      break
  }
  return (
    <Dialog open={isOpen} onOpenChange={onCloseModal}>
      <DialogContent className={sizeClass}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}

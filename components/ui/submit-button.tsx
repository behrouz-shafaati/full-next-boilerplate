'use client';

import { useFormStatus } from 'react-dom';
import { LoadingButton } from './loading-button';

type SubmitButtonProps = {
  text?: string;
  className?: string;
};
export function SubmitButton({
  text = 'ذخیره',
  className = '',
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <LoadingButton type="submit" loading={pending} className={className}>
      {text}
    </LoadingButton>
  );
}

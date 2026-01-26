// atoms
import { useAtom } from 'jotai';
import { confirmAtom } from '~/data/confirmData';
// shadcn/ui
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
// icons
import { Ban, Info, TriangleAlert } from 'lucide-react';

export function CommonAlert() {
  const [confirmContent, setConfirmContent] = useAtom(confirmAtom);

  const handleClose = async (result: boolean) => {
    if (confirmContent.resolver) {
      confirmContent.resolver(result);
    }
    setConfirmContent({ ...confirmContent, open: false });
  };

  return (
    <AlertDialog open={confirmContent.open}>
      <AlertDialogContent size={confirmContent.options.size}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {confirmContent.options.icon === 0 ? (
              <Info />
            ) : confirmContent.options.icon === 1 ? (
              <TriangleAlert />
            ) : (
              <Ban />
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {confirmContent.options.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleClose(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleClose(true)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

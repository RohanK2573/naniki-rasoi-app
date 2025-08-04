import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface CookSwitchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentCookName: string;
  newCookName: string;
  onConfirmSwitch: () => void;
  onCancel: () => void;
}

const CookSwitchDialog = ({
  isOpen,
  onOpenChange,
  currentCookName,
  newCookName,
  onConfirmSwitch,
  onCancel
}: CookSwitchDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Switch Cook?</AlertDialogTitle>
          <AlertDialogDescription>
            You have items from <strong>{currentCookName}</strong> in your cart. 
            Adding items from <strong>{newCookName}</strong> will clear your current cart.
            <br /><br />
            Would you like to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Keep Current Cart
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmSwitch}>
            Switch to {newCookName}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CookSwitchDialog;
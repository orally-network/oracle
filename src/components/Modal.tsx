import { Modal as NextUIModal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';
import { elementBackground } from 'Styles/variables.module.scss';

export const useModal = () => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  return {
    isOpen,
    onOpen,
    onClose,
    onOpenChange,
  };
};

interface Action {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default';
  disabled?: boolean,
}

interface ModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  actions?: Action[];
  children: React.ReactNode;
  title: string;
}

export const Modal = ({ isOpen, onOpenChange, actions = [], children, title }: ModalProps) => {
  return (
    <NextUIModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      style={{ background: elementBackground }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              {children}
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              {actions.map(({ label, onPress, variant, disabled }) => (
                <Button
                  key={label}
                  color={variant || 'primary'}
                  onPress={onPress}
                  disabled={disabled}
                >
                  {label}
                </Button>
              ))}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </NextUIModal>
  )
}

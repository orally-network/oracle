import { useGlobalState } from 'Providers/GlobalState';
import { SignInButton } from 'Shared/SignInButton';

export const AuthorizedActions = ({ children }: any) => {
  const { addressData } = useGlobalState();

  return (
    <div className="flex justify-between gap-2">
      {addressData && addressData.signature ? (
        <>{children}</>
      ) : (
        <SignInButton style={{ alignSelf: 'flex-end' }} />
      )}
    </div>
  );
};

import { useGlobalState } from 'Providers/GlobalState';
import { SignInButton } from 'Shared/SignInButton';
import { SybilTopUp } from 'Shared/SybilTopUp';

export const Actions = () => {
  const { addressData } = useGlobalState();

  return (
    <div className="flex justify-between gap-2">
      {addressData && addressData.signature ? (
        <>
          <SybilTopUp />
        </>
      ) : (
        <SignInButton style={{ alignSelf: 'flex-end' }}/>
      )}
    </div>
  );
};

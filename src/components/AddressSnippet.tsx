import { Snippet } from '@nextui-org/react';

import { truncateAddressSymbolsNum } from 'Utils/addressUtils';

export const AddressSnippet = ({ address, title }: { address: string, title: string }) => {
  return (
    <div className="flex flex-col">
      <span className="text text-gray-500">
        {title}
      </span>

      <Snippet
        codeString={address}
        symbol=""
        variant="bordered"
        size="sm"
      >
        {truncateAddressSymbolsNum(address, 6)}
      </Snippet>
    </div>
  )
};

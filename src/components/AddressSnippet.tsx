import { Snippet } from '@nextui-org/react';

import { truncateAddressSymbolsNum } from 'Utils/addressUtils';

export const AddressSnippet = ({ address }: { address: string }) => {
  return (
    <Snippet
      codeString={address}
      symbol=""
      variant="bordered"
      size="sm"
    >
      {truncateAddressSymbolsNum(address, 6)}
    </Snippet>
  )
};

export const AddressSnippetWithLabel = ({ address, title }: { address: string, title: string }) => {
  return (
    <div className="flex flex-col">
      <span className="text text-gray-500">
        {title}
      </span>

      <AddressSnippet address={address}/>
    </div>
  )
};

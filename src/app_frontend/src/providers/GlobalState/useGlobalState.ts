import { useContext } from 'react';

import GlobalStateContext from './GlobalStateContext';

const useGlobalState = () => useContext(GlobalStateContext);

export default useGlobalState;

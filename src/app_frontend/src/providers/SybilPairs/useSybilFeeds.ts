import { useContext } from 'react';

import SybilFeedsContext from './SybilFeedsContext';

const useSybilData = () => useContext(SybilFeedsContext);

export default useSybilData;

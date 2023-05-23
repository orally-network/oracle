import { useContext } from 'react';

import PythiaDataContext from './PythiaDataContext';

const usePythiaData = () => useContext(PythiaDataContext);

export default usePythiaData;

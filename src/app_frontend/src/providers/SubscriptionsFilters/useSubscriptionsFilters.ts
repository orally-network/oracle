import { useContext } from "react";

import SubscriptionsFiltersContext from "./SubscriptionsFiltersContext";

const useSubscriptionsFilters = () => useContext(SubscriptionsFiltersContext);

export default useSubscriptionsFilters;

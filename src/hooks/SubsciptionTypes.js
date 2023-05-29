import { mapKeys } from 'lodash-es';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { ChildrenPropType } from 'consts/prop-types';
import services from 'services';

const initState = {
  subscriptionTypes: null,
};

const SubscriptionTypesContext = createContext(initState);

export const SubscriptionTypesProvider = ({ children }) => {
  const [state, setState] = useState(initState);
  const { subscriptionTypes } = state;

  const updateSubscriptionTypes = useCallback((result) => {
    setState({ subscriptionTypes: mapKeys(result, ({ id }) => id) });
  }, []);

  const loadSubscriptionTypes = useCallback(
    () =>
      services.getSubscriptionTypes({ detailed: true }).then((response) => {
        updateSubscriptionTypes(response?.data?.result);
      }),
    [updateSubscriptionTypes],
  );

  const addSubscriptionType = useCallback(
    (title) =>
      services.addSubscriptionType({ title }).then((response) => {
        updateSubscriptionTypes(response?.data?.result);
      }),
    [updateSubscriptionTypes],
  );

  useEffect(() => {
    if (subscriptionTypes) {
      return;
    }
    loadSubscriptionTypes();
  }, [loadSubscriptionTypes, subscriptionTypes]);

  const ctx = useMemo(
    () => ({
      subscriptionTypes,
      loadSubscriptionTypes,
      addSubscriptionType,
    }),
    [subscriptionTypes, loadSubscriptionTypes, addSubscriptionType],
  );

  return <SubscriptionTypesContext.Provider value={ctx}>{children}</SubscriptionTypesContext.Provider>;
};

SubscriptionTypesProvider.propTypes = {
  children: ChildrenPropType.isRequired,
};

export const useSubscriptionTypes = () => useContext(SubscriptionTypesContext);

export const withSubscriptionTypes = () => (Component) => (innerProps) => {
  const subscriptionTypes = useSubscriptionTypes();
  return <Component subscriptionTypes={subscriptionTypes} {...innerProps} />;
};

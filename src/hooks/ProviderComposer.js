import { flowRight, isArray } from 'lodash-es';
import React from 'react';

const ProviderComposer = ({ providers, children }) =>
  flowRight(
    ...providers.map((provider) => {
      if (isArray(provider)) {
        const [Provider, props] = provider;
        return props ? () => <Provider {...props} /> : Provider;
      }

      return provider;
    }),
  )(children);

export default ProviderComposer;

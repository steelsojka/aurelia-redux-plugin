import { ObserverLocator } from 'aurelia-framework';
import { ReduxObservationAdapter } from './ReduxObservationAdapter';
import { Store } from './Store';

export function configure<S>(config: any, pluginConfig: { store?: Redux.Store<S> }): void {
  const container = config.container;
  const store = container.get(Store);
  
  if (pluginConfig.store) {
    store.provideStore(pluginConfig.store);
  }

  container.get(ObserverLocator).addAdapter(container.get(ReduxObservationAdapter));
}

export * from './Store';
export * from './select';
export * from './dispatch';
export * from './ReduxObservationAdapter';
export * from './ReduxPropertyObserver';
import { ObserverLocator, Container } from 'aurelia-framework';
import { ReduxObservationAdapter } from './ReduxObservationAdapter';
import { Store, ReduxPluginConfig } from './Store';

export function configure<S>(config: any, pluginConfig: ReduxPluginConfig<S>): void {
  const container = config.container as Container;
  const store = container.invoke(Store, [pluginConfig]);

  container.registerInstance(Store, store);

  container.get(ObserverLocator).addAdapter(container.get(ReduxObservationAdapter));
}

export * from './Store';
export * from './select';
export * from './dispatch';
export * from './ReduxObservationAdapter';
export * from './ReduxPropertyObserver';
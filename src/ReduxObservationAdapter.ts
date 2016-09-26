import { inject } from 'aurelia-framework';
import { ReduxPropertyObserver } from './redux-observer';
import { Store } from './Store';

@inject(Store)
export class ReduxObservationAdapter<S> {
  constructor(private store: Store<S>) {}
  
  getObserver<T>(object: any, propertyName: string, descriptor: any): ReduxPropertyObserver<T, S>|null {
    if (descriptor && descriptor.get && descriptor.get.__redux__) {
      return new ReduxPropertyObserver<T, S>(object, propertyName, this.store);
    }

    return null;
  }
}
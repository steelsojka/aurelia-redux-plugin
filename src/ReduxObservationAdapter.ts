import { inject, TaskQueue, metadata } from 'aurelia-framework';
import { ReduxPropertyObserver } from './ReduxPropertyObserver';
import { Store } from './Store';

@inject(Store, TaskQueue)
export class ReduxObservationAdapter<S> {
  constructor(
    private store: Store<S>,
    private taskQueue: TaskQueue
  ) {}
  
  getObserver<T>(object: any, propertyName: string, descriptor: any): ReduxPropertyObserver<T, S>|null {
    const isReduxSelector = metadata.get('redux:selector', Object.getPrototypeOf(object), propertyName));
    
    if (isReduxSelector) {
      return new ReduxPropertyObserver<T, S>(object, propertyName, this.store, this.taskQueue);
    }

    return null;
  }
}
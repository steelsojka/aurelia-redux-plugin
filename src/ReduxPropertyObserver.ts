import { TaskQueue } from 'aurelia-framework';
import { subscriberCollection } from 'aurelia-binding';
import { Store } from './Store';

@subscriberCollection()
export class ReduxPropertyObserver<T, S> {
  addSubscriber: Function;
  removeSubscriber: Function;
  callSubscribers: (val: T, old: T) => void;
  
  private isSubscribed: boolean = false;
  private subscribers: number = 0;
  private subscription: Redux.Unsubscribe|null;
  private lastValue: T|null;
  private queued: boolean = false;
  
  constructor(
    private obj: any, 
    private propertyName: string,
    private store: Store<S>,
    private taskQueue: TaskQueue
  ) {}

  getValue(): T {
    return this.obj[this.propertyName];
  }

  setValue(value: T) {
    throw new Error('AureliaRedux -> Properties must be set through a dispatched action!');
  }

  subscribe(context: string, callable: Function): void {
    this.addSubscriber(context, callable);
    this.subscribers++;

    if (!this.isSubscribed) {
      this.subscription = this.store.subscribe(this.onUpdate.bind(this));
      this.isSubscribed = true;
    }
  }

  unsubscribe(context: string, callable: Function): void {
    this.removeSubscriber(context, callable);
    this.subscribers--;

    if (this.subscribers < 1) {
      if (this.subscription) {
        this.subscription();
        this.subscription = null;
      }
      
      this.isSubscribed = false;
    }
  }

  unbind(): void {
    if (this.subscription) {
      this.subscription();  
      this.subscription = null;
      this.lastValue = null;
    }
  }

  call(): void {
    const currentValue = this.obj[this.propertyName];
    
    if (currentValue !== this.lastValue) {
      this.callSubscribers(currentValue, <T>this.lastValue);
      this.lastValue = currentValue;
    }

    this.queued = false;
  }

  onUpdate(): void {
    if (!this.queued) {
      this.taskQueue.queueMicroTask(this);
      this.queued = true;
    }
  }
}
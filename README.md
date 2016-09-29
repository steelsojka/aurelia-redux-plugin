aurelia-redux-plugin
====================

A Redux plugin for the Aurelia framework.

Install
-------

`npm install --save aurelia-redux-plugin`

Configure
---------

Simply include `aurelia-redux-plugin` as a plugin in your aurelia config.

```javascript
import { createStore } from 'redux';
import { rootReducer } from '../reducers';

export function configure(aurelia) {
  aurelia.use
    .standardConfigurtion()
    .developmentLogging()
    .plugin('aurelia-redux-plugin', {
      store: createStore(rootReducer)
    });
}
```

You can also provide the store during your applications main component lifecycle.

```typescript
import { inject } from 'aurelia-framework';
import { Store } from 'aurelia-redux-plugin';
import { createStore } from 'redux';
import { rootReducer } from '../reducers';

@inject(Store)
class MyApp {
  constructor(store: Store) {
    store.provideStore(createStore(rootReducer));
  }
}
```

The plugin lets you supply your own store instead of wrapping an api to create it for
you. Simply create your store and provide it to the plugin. Note, this plugin has no control
over your reducers or action creators. It is merely an adapter to Aurelia's binding engine and 
an adapter to your view model and services to select data and dispatch events. How you create/organize your data/reducers/actions is
up to you.

Using the Store
---------------

The store can be injected using Aurelia's dependency inject container. The wrapped store
contains the same API as a typical redux store.

```typescript
import { inject } from 'aurelia-framework';
import { Store } from 'aurelia-redux-plugin';

@inject(Store)
class MyViewModel {
  constructor(private store: Store) {}

  setFirstName(name: string): void {
    this.store.dispatch({ type: 'SET_FIRST_NAME', payload: 'Jimmy Joe Joe' });
  }
}
```

Using the Dispatch Decorator
----------------------------

Using the store directly is easy, but you can make this more declarative by using the `dispatch` decorator.

```typescript
import { dispatch } from 'aurelia-redux-plugin';

class MyViewModel {
  @dispatch('SET_FIRST_NAME')
  setFirstName: (payload: { payload: string}) => void;
}
```

This dispatchs an action that looks like this `{ type: 'SET_FIRST_NAME', payload: 'Fran' }`.
You can also provide other options to get more control over action creation.


```typescript
import { dispatch } from 'aurelia-redux-plugin';

const setFirstName = (name: string) => ({ type: 'SET_FIRST_NAME', payload: name });

class MyViewModel {
  // Using an action creator
  @dispatch(setFirstName)
  setFirstName: (name: string) => void;
}

const vm = new MyViewModel();

vm.setFirstName('Steven'); // Dispatches { type: 'SET_FIRST_NAME', payload: 'Steven' }
```

You can provide an optional creator on the class that will delegate the dispatch action.

```typescript
import { dispatch } from 'aurelia-redux-plugin';

const setFirstName = (name: string) => ({ type: 'SET_FIRST_NAME', payload: name });

class MyViewModel {
  // Using an action creator
  @dispatch(setFirstName, { creator: 'firstNameCreator' })
  setFirstName: (name: string) => void;

  firstNameCreator(dispatch: Function, name: string): void {
    // The dispatch function is prebound to the supplied action creator.
    dispatch(name.toUpperCase());
  }
}

const vm = new MyViewModel();

vm.setFirstName('Steven'); // Dispatches { type: 'SET_FIRST_NAME', payload: 'STEVEN' }
```

Selectors
---------

You can assign a selector to property by using the `select` decorator.

```typescript
import { select } from 'aurelia-redux-plugin';

// Assuming state
const state = {
  activeUser: {
    name: 'Sven'
  } 
};

class ActiveUser {
  @select('activeUser.name')
  name: string;
}

// The activeUser class will report -> 'Sven'.
```

Ideally you will use selector functions to generate your derived data.


```typescript
import { select } from 'aurelia-redux-plugin';

// Assuming state
const state = {
  activeUser: {
    name: 'Sven'
  },
  entities: {
    users: {
      1: { name: 'Joe' },
      2: { name: 'Blorg' },
      3: { name: 'Khan' }
    }  
  } 
};

const getAllUserNames = state => state.entities.users.map(u => u.name);

class ActiveUser {
  @select(getAllUserNames)
  userNames: string[];
}

// userNames will return ['Joe', 'Blorg', 'Khan']
```

You can also provide an optional subscribe option to be notify when the value has changed.

```typescript
class ActiveUser {
  @select(getAllUserNames, { subscribe: true })
  userNames: string[];

  userNamesChanged(newValue: string[], oldValue?: string[]): void {
    // Do something here  
  }
}
```

What's supported
----------------
- Selectors
- Memoized selectors (Supports selector libraries like `reselect`)
- Async dispatch and thunks
- Dispatch shorthand methods
- Change notification with selectors
- Aurelia observer adapter for properties decorated with a selector
- Store access through dependency injection

What's not supported
-------------------
- Multiple stores (currently only a single store is supported for application)

Inspired By
-----------
[ng2-redux](https://github.com/angular-redux/ng2-redux)
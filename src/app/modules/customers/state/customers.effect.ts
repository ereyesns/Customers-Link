import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {CustomersService} from "../services/customers.service";
import {select, Store} from "@ngrx/store";
import {
  customersFetchDataSourceSuccess,
  deleteCustomerSuccess,
  editCustomerSuccess,
  invokeCustomersDataSource,
  invokeDeleteCustomer,
  invokeEditCustomer,
  invokeSaveNewCustomer,
  saveNewCustomerSuccess
} from "./customers.action";
import {EMPTY, map, mergeMap, switchMap, withLatestFrom} from "rxjs";
import {selectCustomers} from "./customers.selector";

@Injectable()
export class CustomersEffect {
  constructor(
    private actions$: Actions,
    private customersService: CustomersService,
    private store: Store
  ) {
  }

  loadAllCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(invokeCustomersDataSource),
      withLatestFrom(this.store.pipe(select(selectCustomers))),
      mergeMap(([, customers]) => {
        if (customers.length > 0) {
          return EMPTY;
        }
        return this.customersService.index().pipe(
          map((customers) => customersFetchDataSourceSuccess({customers}))
        );
      })
    )
  );

  saveNewCustomer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeSaveNewCustomer),
      switchMap((action) => {
        return this.customersService.store(action.customer).pipe(
          map((customer) => saveNewCustomerSuccess({customer}))
        )
      })
    )
  });

  editCustomer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeEditCustomer),
      switchMap((action) => {
        return this.customersService.update(action.customer.id, action.customer).pipe(
          map((customer) => editCustomerSuccess({customer}))
        )
      })
    )
  });

  deleteCustomer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeDeleteCustomer),
      switchMap((action) => {
        return this.customersService.delete(action.customer.id).pipe(
          map(() => deleteCustomerSuccess({customer: action.customer}))
        )
      })
    )
  });

}

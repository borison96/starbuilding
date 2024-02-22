import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { paths } from '..';
import { useDispatch } from '../../hooks';
import { GuardFunc, RouteType } from '../../typings';

function Guard(props: { route: RouteType }) {
  const { route } = props;
  const location = useLocation();
  const dispatch = useDispatch();
  let Component: any = route.component ? <route.component /> : null;
  if (route.component && route.layout) {
    Component = (
      <route.layout {...(props.route.layoutProps ?? {})}>
        <route.component />
      </route.layout>
    );
  }
  if (route.guards && route.guards.length > 0) {
    const caught = 'guard-caught';
    try {
      route.guards.forEach((guard: GuardFunc) => {
        if (typeof guard === 'function') {
          const g = guard({ location, dispatch });
          if (typeof g === 'string') {
            Component = <Navigate replace to={g} />;
            throw Error(caught);
          } else if (typeof g === 'boolean' && !g) {
            Component = <Navigate replace to={paths.AUTH} />;
            throw Error(caught);
          }
        }
      });
    } catch (e: any) {
      if (e?.message !== caught) {
        throw e;
      }
    }
  }
  return Component as ReactElement<any, any>;
}

export default Guard;

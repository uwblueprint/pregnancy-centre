import { Redirect, Route, RouteProps } from "react-router-dom";
import React from 'react'

type Props = RouteProps & {
  isAuthenticated: boolean,
  authenticationPath: string
}

const PrivateRoute: React.FunctionComponent<Props> = ({ isAuthenticated, authenticationPath, ...routeProps }: Props) => {
  if (isAuthenticated) {
    return <Route {...routeProps} />;
  } else {
    return <Redirect to={{ pathname: authenticationPath }} />;
  }
};

export default PrivateRoute

import { useEffect } from "react";
import useReactRouter from "use-react-router";
import { useSessionValue } from "../components/Session";
import * as ROUTES from "../constants/routes";

function useAuthorization(condition) {
  const [{ firebase }] = useSessionValue();
  const { history } = useReactRouter();
  useEffect(
    () => {
      const unsubscribe = firebase.onAuthUserListener(
        authUser => {},
        () => history.push(ROUTES.SIGN_IN)
      );

      return () => unsubscribe();
    },
    [firebase, history]
  );
}

export default useAuthorization;

import Button from "@mui/material/Button";
import React from "react";
import { LOGIN_URL, REGISTER_URL } from "../constants/api";
import SessionCheck from "../features/auth/AuthHelper";

const Login = () => {
  return (
    <React.Fragment>
      <SessionCheck
        onAuthenticated={() => (window.location.href = "/")}
        refetchInterval={0}
      />
      <Button variant="outlined" href={LOGIN_URL}>
        Login with Google
      </Button>
      <Button variant="outlined" href={REGISTER_URL}>
        Register with Google
      </Button>
    </React.Fragment>
  );
};

export default Login;

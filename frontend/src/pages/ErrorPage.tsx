import { useRouteError } from "react-router-dom";
import { ErrorCard } from "../features/error_card/ErrorCard";

const getErrorText = (status: number) => {
  switch (status) {
    case 404: {
      return "Page not found!";
    }
    case 500: {
      return "Server error!";
    }
    default: {
      return "Unknown error!";
    }
  }
};

const getErrorDetails = (status: number) => {
  switch (status) {
    case 404: {
      return "The page you are looking for does not exist!";
    }
    case 500: {
      return "Issue on the server side... Please try again soon!";
    }
    default: {
      return "We have no idea what happened... Please try again!";
    }
  }
};

export default function ErrorPage() {
  const error = useRouteError();
  const status = (error as any).status;
  const statusText = getErrorText(status);
  const details = getErrorDetails(status);

  return <ErrorCard message={statusText} details={details} />;
}

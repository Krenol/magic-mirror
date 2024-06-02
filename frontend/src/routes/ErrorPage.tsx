import { ErrorComponent } from "../components/error_component/ErrorComponent";

type ErrorType = {
  title?: string;
  details?: string;
  navigateTo?: string;
};

const getErrorDetails = (type: string): ErrorType => {
  switch (type) {
    case "already_registered": {
      return {
        title: "User already registered!",
        details:
          "Seems like you are already registered! Please log in normally...",
        navigateTo: "/",
      };
    }
    case "not_registered": {
      return {
        title: "User not registered!",
        details: "User is not regsitered. Please register first...",
        navigateTo: "/",
      };
    }
    case "unauthorized": {
      return {
        title: "Unauthorized!",
        details: "You are not authorized to regsiter :(",
        navigateTo: "/",
      };
    }
    default: {
      return {
        title: "Unknown error!",
        details: "We have no idea what happened... Please try again!",
      };
    }
  }
};

export default function ErrorPage() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type") ?? "";
  const details = getErrorDetails(type);

  return (
    <ErrorComponent
      title={details.title}
      details={details.details}
      navigateBackTo={details.navigateTo ?? "/"}
    />
  );
}

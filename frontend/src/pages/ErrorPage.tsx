import { ErrorCard } from "../features/error_card/ErrorCard";

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
        navigateTo: "/login",
      };
    }
    case "not_registered": {
      return {
        title: "User not registered!",
        details: "User is not regsitered. Please register first...",
        navigateTo: "/login",
      };
    }
    case "unauthorized": {
      return {
        title: "Unauthorized!",
        details: "You are not authorized to regsiter :(",
        navigateTo: "/login",
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
    <ErrorCard
      title={details.title}
      details={details.details}
      navigateBackTo={details.navigateTo ?? "/"}
    />
  );
}

import { Box } from "@mui/material";
import { SettingsForm } from "../components/settings_form/SettingsForm";
import { useNavigate } from "react-router-dom";
import { useGetUserSettings } from "../apis/user_settings";
import { useEffect } from "react";
import { postUserSettings } from "../apis/users";

export const Registration = () => {
  const navigate = useNavigate();
  const { data: userSettings, isLoading, error } = useGetUserSettings(true);

  useEffect(() => {
    if (userSettings?.city) {
      navigate("/settings");
    }
  }, [userSettings, navigate]);

  const addUserSettings = (
    country: string,
    city?: string,
    zipCode?: string
  ) => {
    postUserSettings(country, city, zipCode)
      .then(() => navigate("/"))
      .catch(alert);
  };

  if (isLoading) return <Box>Loading...</Box>;

  if (error) {
    navigate("/");
    return <Box>Error!</Box>;
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <SettingsForm showBackButton={false} onSend={addUserSettings} />
    </Box>
  );
};

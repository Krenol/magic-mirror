import { Box, TextField, Button } from "@mui/material";
import CountrySelect from "../country_select/CountrySelect";
import { useRef, useState } from "react";
import {
  buttonBoxStyle,
  countryBoxStyle,
  inputBoxStyle,
  parentBoxStyle,
} from "./style";
import { buildQuery } from "../../helpers/apis";
import { LOCATION_API } from "../../constants/api";

type Props = {
  defaultCity?: string;
  defaultCountry?: string;
  defaultZipCode?: string;
  showBackButton?: boolean;
  onSend?: (country: string, city?: string, zipCode?: string) => void;
  onBack?: () => void;
};

export const SettingsForm = ({
  defaultCity = "Stuttgart",
  defaultCountry = "DE",
  defaultZipCode = "70176",
  showBackButton = true,
  onSend,
  onBack,
}: Props) => {
  const city = useRef<HTMLInputElement>();
  const zip = useRef<HTMLInputElement>();
  const [country, setCountry] = useState(defaultCountry);

  const onSendButton = () => {
    if (country === "") {
      alert("Country must not be empty!");
    } else {
      validate(country, city.current?.value, zip.current?.value)
        .then(handleValidInput)
        .catch(() => alert("Address could not be geolocated!"));
    }
  };

  const handleValidInput = async () => {
    if (onSend) {
      onSend(country, city.current?.value, zip.current?.value);
    }
  };

  return (
    <Box sx={parentBoxStyle}>
      <Box sx={countryBoxStyle}>
        <CountrySelect
          inputCallback={setCountry}
          defaultCountryCode={defaultCountry}
        />
      </Box>
      <Box component="form" sx={inputBoxStyle} noValidate autoComplete="off">
        <TextField
          id="city"
          label="City"
          variant="outlined"
          inputRef={city}
          defaultValue={defaultCity}
        />
        <TextField
          id="zip"
          label="Zip Code"
          variant="outlined"
          inputRef={zip}
          defaultValue={defaultZipCode}
        />
      </Box>
      <Box sx={buttonBoxStyle}>
        <Button variant="outlined" onClick={onSendButton}>
          Send
        </Button>
        {(showBackButton || onBack) && (
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
        )}
      </Box>
    </Box>
  );
};

const validate = async (country: string, city?: string, zipCode?: string) => {
  const queryParams = [
    {
      name: "city",
      value: city,
    },
    {
      name: "country",
      value: country,
    },
    {
      name: "zip_code",
      value: zipCode,
    },
  ];
  return buildQuery(queryParams)
    .then((qry) => fetch(`${LOCATION_API}/geocode${qry}`))
    .then((res) => {
      if (res.ok) return;
      throw Error();
    })
    .catch((err) => {
      throw err;
    });
};

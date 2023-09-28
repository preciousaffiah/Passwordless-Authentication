import axios from "axios";
import { Document } from "mongodb";

export function getLocation() {
  axios
    .get(
      `https://ipgeolocation.abstractapi.com/v1/?api_key=${process.env.ABSTRACRT_API_KEY}&fields=country`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
}

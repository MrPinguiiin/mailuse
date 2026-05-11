import { env } from "$env/dynamic/public";
import { redirect } from "@sveltejs/kit";

export const load = ({ url }) => {
  if (env.PUBLIC_APP_DOMAIN && url.hostname === `inbox.${env.PUBLIC_APP_DOMAIN}`) {
    redirect(302, "/new");
  }

  if (env.PUBLIC_APP_DOMAIN && url.hostname === `dashboard.${env.PUBLIC_APP_DOMAIN}`) {
    redirect(302, "/dashboard");
  }
};

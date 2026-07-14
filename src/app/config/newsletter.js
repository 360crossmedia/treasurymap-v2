// Zoho Campaigns newsletter signup configuration.
//
// We use Zoho's own hosted sign-up form (the "Optin" URL from the Zoho Campaigns
// embed button). The Subscribe button opens that form in a new tab, so Zoho
// handles the email capture and double opt-in itself · fully reliable, no
// cross-origin POST guesswork. To change the list, replace `optinUrl` with the
// Optin link from Zoho Campaigns > Sign-up Forms > Embed > Button.
//
// Set `enabled` to false to hide the newsletter UI everywhere.
export const newsletter = {
  enabled: true,
  optinUrl:
    "https://hlctn-zcmp.maillist-manage.eu/ua/Optin?od=12ba7e6beda5&zx=14ac32dc43&tD=1167f174a96b8dc1&sD=1167f174aa056c65",
};

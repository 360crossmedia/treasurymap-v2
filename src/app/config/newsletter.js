// Zoho Campaigns newsletter signup configuration.
//
// HOW TO FILL THIS IN (one time):
//  1. Zoho Campaigns > Contacts > Sign-up Forms > pick the TreasuryMap list
//     form > "Embed" (NOT the ATEL / Simply Treasury list).
//  2. From the generated <form>, copy:
//       - the form `action` URL (ends in /weboptin.zc)  -> `action`
//       - the hidden inputs `zx`, `zcld`, `zctd`, `zc_formIx`  -> `hidden`
//  3. Set `enabled` to true.
//
// Until `enabled` is true the NewsletterForm renders nothing, so there is never
// a broken/placeholder form on the live site.
export const newsletter = {
  enabled: true,

  // Zoho "weboptin" endpoint for the TreasuryMap list (account-specific host).
  action: "https://hlctn-zcmp.maillist-manage.eu/weboptin.zc",

  // Field name Zoho expects for the email (default for Campaigns embeds).
  emailField: "CONTACT_EMAIL",

  // Hidden fields copied verbatim from the TreasuryMap Zoho signup form
  // (resolved from the list's embed link).
  hidden: {
    zx: "14ac32dc43",
    zcvers: "2.0",
    mode: "OPTIN",
    zcld: "1167f174aa0462c1",
    zctd: "1167f174a96b8dc1",
    "document.charset": "UTF-8",
    zc_trackCode: "ZCFORMVIEW",
    oldListIds: "",
    zc_formIx: "3z49e7c7be1c576ef11c63e3dec5c1d965eb2e5caeae99c8902d1beeab8eb2a980",
    viewFrom: "SignupFormEmbedInApp",
  },
};

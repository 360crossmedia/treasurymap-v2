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
  enabled: false,

  // Zoho "weboptin" endpoint for the TreasuryMap list (account-specific host).
  action: "https://REPLACE.maillist-manage.com/weboptin.zc",

  // Field name Zoho expects for the email (default for Campaigns embeds).
  emailField: "CONTACT_EMAIL",

  // Hidden fields copied verbatim from the TreasuryMap embed. The REPLACE_*
  // values are list-specific and must come from the real embed.
  hidden: {
    zx: "REPLACE_zx",
    zcvers: "2.0",
    mode: "OPTIN",
    zcld: "REPLACE_zcld",
    zctd: "REPLACE_zctd",
    "document.charset": "UTF-8",
    zc_trackCode: "ZCFORMVIEW",
    oldListIds: "",
    zc_formIx: "REPLACE_zc_formIx",
    viewFrom: "SignupFormEmbedInApp",
  },
};

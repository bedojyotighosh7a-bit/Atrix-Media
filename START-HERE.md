# Atryx Media — original design, revised content

This version starts from the HTML files and logo assets you supplied. It restores your original page designs rather than using the previous redesign.

## Preserved

- Your original fonts: the original system-font stack on index.html; Tomorrow, Hanken Grotesk and JetBrains Mono on the services and thank-you pages.
- Your original hero headings, two-column enquiry layout, dark colours, icons, animated borders, section reveals and thank-you card.
- Your real logo images in the headers, footer and contact section. No typed replacement brand mark.
- Your CNAME and .gitattributes files, and all three supplied image assets, unchanged.

## Updated

- Bengaluru-only production; revised package scopes and clearer service wording.
- Three YouTube-ready video spaces in the original portfolio card style.
- The three quotes and sample content directions below the videos, explicitly labelled as concepts.
- Practical shot lists attached to each video space.
- Form validation, error handling, consent and privacy notice.
- Your animated hero line remains as a decorative design element. The adjacent numbers describe actual Managed Presence deliverables, not invented performance results.

## Put the website on your host

1. Back up your current website.
2. Upload the HTML, CSS, JS, image files and CNAME to your website root, maintaining these filenames. Keep .gitattributes in your repository.
3. The working thank-you filename is atrixwelcome.html; links already use that name. The uploaded filename with “(1)” was normalised.
4. Keep START-HERE.md, VIDEO-GUIDE.md, VERIFICATION.md and Code.gs as setup/reference files; they do not need to be published.
5. Configure and test the enquiry backend before launch (instructions below).

The entry page remains index.html (your original enquiry landing page). The full services page remains about.html.

## Add your three YouTube videos

Open videos.js. At the top are three entries containing `youtube: ''`.
Paste a YouTube URL or video ID between the quotes. Example format:

`{ slot: 1, youtube: 'YOUR_ACTUAL_YOUTUBE_URL', title: 'Your video title' }`

The example is an editing instruction, not a working video URL. The delivered file has empty values, so there are no broken player requests.

- Slot 1: wedding / event transformation.
- Slot 2: interior walkthrough.
- Slot 3: material / product story.

You can use different subjects. Edit the visible title, description and brief in about.html to match. Publish videos as public or unlisted and permit embedding. Re-upload videos.js (and about.html if you changed the text). Refresh without cache.

A configured video first displays a play button. Clicking it loads the YouTube player. Empty slots display “Video coming soon.” No video file needs to be stored on your website.

## Required: connect your enquiry email

The supplied form cannot be verified against your inbox without access to your Google account. The old source had a duplicate `/exec/exec` URL and treated unconfirmed requests as successful. The new code redirects only after a readable `{ "ok": true }` response.

1. Open the Apps Script project for your current form and back up its code. If it does other work, create a separate project.
2. Add the supplied Code.gs handler.
3. In Project Settings → Script properties, set `RECIPIENT_EMAIL` to your receiving email address. Do not place the email setting in frontend JavaScript.
4. Deploy as a Web app, executed as you, accessible to Anyone; authorise its email permission. When updating a deployment, select a new version.
5. Paste the deployment URL ending in `/exec` into config.js. The corrected URL from your original source is already there, but the deployment must use this handler.
6. Open the endpoint and check that it returns the service health JSON. Then submit a clearly labelled test from the hosted site and confirm receipt in your inbox, including the new form fields.
7. If receipt cannot be confirmed, check permissions, Apps Script execution logs, recipient settings and quota. A sign-in page or unreadable cross-origin response is not success. If your deployment does not allow readable responses, use a same-origin backend returning the same response contract; do not restore `no-cors` to hide errors.

Your existing Instagram destination is preserved as an alternative contact route. Check that this is the intended agency account.

## Before launch

- Test the pages on desktop and phone, including navigation and the form.
- Check invoice/tax and cancellation details against your client agreement.
- Follow the privacy notice’s inactive-enquiry retention policy, or edit it to accurately describe your practice.
- Add real client work only with permission. Keep concept labels until a project genuinely becomes client work.

No live website deployment or actual email submission was performed here.

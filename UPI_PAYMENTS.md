# UPI-First Payments Guide

This project is configured for a solo-operator, UPI-first payment flow. Students pay directly to your UPI ID and submit the UTR/reference in the enrollment modal.

What’s included
- Central config at `src/config/site.config.js` with:
  - brandName, legalName, supportEmail, supportPhone
  - upiId, upiPayeeName
- Enrollment modal defaults to UPI and shows a deep link button: upi://pay?pa=...&pn=...&am=...
- Manual reference capture and automated enrollment + email notifications

Setup steps
1) Edit `src/config/site.config.js`:
   - Set `brandName` and `legalName`
   - Set `supportEmail` and `supportPhone`
   - Set `upiId` (e.g., yourname@paytm) and `upiPayeeName`
2) Test the UPI deep link on a mobile device.
3) Verify you receive the student’s payment reference and emails.

Operational tips
- Ask students to paste the exact UTR/Reference ID from their UPI app.
- Optionally request a screenshot via follow-up email if verification is needed.
- You can later re-enable a gateway (e.g., PhonePe) without changing the manual UPI flow.

Notes
- Legal and privacy pages were generalized to "payment processors or UPI apps" to fit this mode.
- Receipts on the success page use the centralized branding and support info.

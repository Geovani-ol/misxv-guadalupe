import { Resend } from "resend";

const resendApiKey = import.meta.env.RESEND_API_KEY!;
const resend = new Resend(resendApiKey);

export default resend;

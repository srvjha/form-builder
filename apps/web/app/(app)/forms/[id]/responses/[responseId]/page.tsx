import { redirect } from "next/navigation";

/* Old "View Response" emails link here — forward to the list with the response expanded */
export default async function ResponseRedirect({
  params,
}: {
  params: Promise<{ id: string; responseId: string }>;
}) {
  const { id, responseId } = await params;
  redirect(`/forms/${id}/responses?response=${responseId}`);
}

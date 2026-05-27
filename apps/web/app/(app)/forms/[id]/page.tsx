import { redirect } from "next/navigation";

export default function FormPage({ params }: { params: { id: string } }) {
  redirect(`/forms/${params.id}/edit`);
}

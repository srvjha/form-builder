"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { ROUTES } from "@/lib/constants";
import { DEFAULT_MAX_FIELDS } from "@/stores/builder-store";
import { getTemplate, type TemplateField } from "@/lib/templates";

interface CreateFormInput {
  title:        string;
  description?: string;
  templateId:   string;
  maxFields?:   number;
}

/**
 * Creates a form, seeds the chosen template's fields, then opens the builder.
 * Shared by /forms/new and /templates so both create forms the same way.
 */
export function useCreateForm() {
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);

  const utils            = trpc.useUtils();
  const createMutation   = trpc.forms.create.useMutation();
  const addFieldMutation = trpc.forms.addField.useMutation();

  const isPending = createMutation.isPending || seeding;

  async function createForm({ title, description, templateId, maxFields }: CreateFormInput) {
    try {
      const form = await createMutation.mutateAsync({
        title:       title.trim(),
        description: description?.trim() || undefined,
        settings: {
          showProgressBar:  true,
          shuffleFields:    false,
          oneResponsePerIp: false,
          requireAuth:      false,
          maxFields:        maxFields ?? DEFAULT_MAX_FIELDS,
        },
      });

      const templateFields = (getTemplate(templateId)?.fields ?? []) as readonly TemplateField[];

      if (templateFields.length > 0) {
        setSeeding(true);
        // Seed fields in parallel for speed
        await Promise.all(
          templateFields.map((f) =>
            addFieldMutation.mutateAsync({
              formId:      form.id,
              type:        f.type,
              label:       f.label,
              placeholder: f.placeholder,
              helpText:    f.helpText,
              required:    f.required ?? false,
              options:     f.options,
              minValue:    f.minValue,
              maxValue:    f.maxValue,
              minLabel:    f.minLabel,
              maxLabel:    f.maxLabel,
              validations: {},
            }),
          ),
        );
        setSeeding(false);
      }

      utils.forms.list.invalidate();
      toast.success("Form created");
      router.push(ROUTES.formEdit(form.id));
      return true;
    } catch (err: any) {
      setSeeding(false);
      toast.error(err?.message ?? "Failed to create form");
      return false;
    }
  }

  return { createForm, isPending, seeding };
}

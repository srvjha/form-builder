import { create } from "zustand";
import { temporal } from "zundo";

export type FieldType =
  | "short_text" | "long_text" | "email" | "number" | "phone" | "url"
  | "date" | "time" | "select" | "multi_select" | "checkbox"
  | "rating" | "scale" | "file_upload";

export interface FieldOption {
  value: string;
  label: string;
  imageUrl?: string;
}

export interface FieldValidations {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  patternMessage?: string;
}

export interface BuilderField {
  id:           string;
  type:         FieldType;
  label:        string;
  placeholder?: string;
  helpText?:    string;
  required:     boolean;
  validations:  FieldValidations;
  options?:     FieldOption[];
  minValue?:    number;
  maxValue?:    number;
  minLabel?:    string;
  maxLabel?:    string;
  order:        number;
}

export interface BuilderFormState {
  id?:            string;
  title:          string;
  description?:   string;
  visibility:     "public" | "unlisted";
  collectEmail:   boolean;
  successMessage?: string;
  redirectUrl?:   string;
  maxResponses?:  number;
  closesAt?:      string;
  settings: {
    showProgressBar:  boolean;
    shuffleFields:    boolean;
    oneResponsePerIp: boolean;
    requireAuth:      boolean;
  };
}

interface BuilderState {
  /* Form meta */
  form:         BuilderFormState;
  fields:       BuilderField[];
  activeFieldId: string | null;
  isDirty:      boolean;
  isSaving:     boolean;
  previewMode:  boolean;
  settingsOpen: boolean;

  /* Actions */
  setForm:       (patch: Partial<BuilderFormState>) => void;
  setFields:     (fields: BuilderField[]) => void;
  addField:      (field: Omit<BuilderField, "order">) => void;
  updateField:   (id: string, patch: Partial<BuilderField>) => void;
  removeField:   (id: string) => void;
  reorderFields: (fromIndex: number, toIndex: number) => void;
  setActiveField:(id: string | null) => void;
  setDirty:      (dirty: boolean) => void;
  setIsSaving:   (saving: boolean) => void;
  setPreviewMode:(enabled: boolean) => void;
  setSettingsOpen:(open: boolean) => void;
  resetBuilder:  () => void;
}

const defaultForm: BuilderFormState = {
  title:       "Untitled Form",
  visibility:  "unlisted",
  collectEmail: false,
  settings: {
    showProgressBar:  true,
    shuffleFields:    false,
    oneResponsePerIp: false,
    requireAuth:      false,
  },
};

export const useBuilderStore = create<BuilderState>()(
  temporal(
    (set, get) => ({
      form:          defaultForm,
      fields:        [],
      activeFieldId: null,
      isDirty:       false,
      isSaving:      false,
      previewMode:   false,
      settingsOpen:  false,

      setForm: (patch) =>
        set((s) => ({ form: { ...s.form, ...patch }, isDirty: true })),

      setFields: (fields) =>
        set({ fields, isDirty: true }),

      addField: (field) =>
        set((s) => {
          const order = s.fields.length;
          const newField: BuilderField = { ...field, order };
          return {
            fields:        [...s.fields, newField],
            activeFieldId: field.id,
            isDirty:       true,
          };
        }),

      updateField: (id, patch) =>
        set((s) => ({
          fields:  s.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
          isDirty: true,
        })),

      removeField: (id) =>
        set((s) => ({
          fields:        s.fields.filter((f) => f.id !== id).map((f, i) => ({ ...f, order: i })),
          activeFieldId: s.activeFieldId === id ? null : s.activeFieldId,
          isDirty:       true,
        })),

      reorderFields: (fromIndex, toIndex) =>
        set((s) => {
          const fields = [...s.fields];
          const [moved] = fields.splice(fromIndex, 1);
          fields.splice(toIndex, 0, moved!);
          return {
            fields:  fields.map((f, i) => ({ ...f, order: i })),
            isDirty: true,
          };
        }),

      setActiveField:  (id)      => set({ activeFieldId: id }),
      setDirty:        (dirty)   => set({ isDirty: dirty }),
      setIsSaving:     (saving)  => set({ isSaving: saving }),
      setPreviewMode:  (enabled) => set({ previewMode: enabled }),
      setSettingsOpen: (open)    => set({ settingsOpen: open }),

      resetBuilder: () =>
        set({
          form:          defaultForm,
          fields:        [],
          activeFieldId: null,
          isDirty:       false,
          isSaving:      false,
          previewMode:   false,
          settingsOpen:  false,
        }),
    }),
    {
      limit: 50, // undo history depth
      partialize: (state) => ({
        form:   state.form,
        fields: state.fields,
      }),
    },
  ),
);

export const APP_NAME = "FormCraft";
export const APP_DESCRIPTION = "The form builder that doesn't apologise.";

export const ROUTES = {
  home:        "/",
  signIn:      "/sign-in",
  signUp:      "/sign-up",
  dashboard:   "/dashboard",
  forms:       "/forms",
  formNew:     "/forms/new",
  formEdit:    (id: string) => `/forms/${id}/edit`,
  formResponses: (id: string) => `/forms/${id}/responses`,
  formAnalytics: (id: string) => `/forms/${id}/analytics`,
  publicForm:  (slug: string) => `/f/${slug}`,
  explore:     "/explore",
  analytics:   "/analytics",
  templates:   "/templates",
  admin:       "/admin",
  settings:    "/settings",
  settingsAppearance:    "/settings/appearance",
  settingsNotifications: "/settings/notifications",
  pricing:     "/pricing",
  about:       "/about",
} as const;

export const FIELD_TYPES = [
  { type: "short_text",   label: "Short Text",   icon: "Type" },
  { type: "long_text",    label: "Long Text",    icon: "AlignLeft" },
  { type: "email",        label: "Email",        icon: "Mail" },
  { type: "number",       label: "Number",       icon: "Hash" },
  { type: "phone",        label: "Phone",        icon: "Phone" },
  { type: "url",          label: "URL",          icon: "Link" },
  { type: "date",         label: "Date",         icon: "Calendar" },
  { type: "time",         label: "Time",         icon: "Clock" },
  { type: "select",       label: "Single Select", icon: "ChevronDown" },
  { type: "multi_select", label: "Multi Select", icon: "CheckSquare" },
  { type: "checkbox",     label: "Checkbox",     icon: "Check" },
  { type: "rating",       label: "Rating",       icon: "Star" },
  { type: "scale",        label: "Scale / NPS",  icon: "Sliders" },
  { type: "file_upload",  label: "File Upload",  icon: "Upload" },
] as const;

export const FORM_STATUS_LABELS = {
  draft:     "Draft",
  published: "Published",
  closed:    "Closed",
  archived:  "Archived",
} as const;

export const FORM_STATUS_COLORS = {
  draft:     { bg: "bg-zinc-100 dark:bg-zinc-800/70",  text: "text-zinc-700 dark:text-zinc-200", border: "border-zinc-200 dark:border-zinc-700" },
  published: { bg: "bg-blue-50 dark:bg-blue-500/15",   text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-500/30" },
  closed:    { bg: "bg-zinc-50 dark:bg-zinc-900",      text: "text-zinc-500 dark:text-zinc-400", border: "border-zinc-200 dark:border-zinc-800" },
  archived:  { bg: "bg-transparent",                   text: "text-zinc-500 dark:text-zinc-500", border: "border-zinc-200 dark:border-zinc-800" },
} as const;

export const NAV_ITEMS = [
  { label: "Dashboard",  href: ROUTES.dashboard,  icon: "LayoutDashboard" },
  { label: "Forms",      href: ROUTES.forms,       icon: "FileText" },
  { label: "Analytics",  href: ROUTES.analytics,   icon: "BarChart3" },
  { label: "Templates",  href: ROUTES.templates,   icon: "LayoutTemplate" },
  { label: "Explore",    href: ROUTES.explore,     icon: "Compass" },
] as const;

export const NAV_BOTTOM_ITEMS = [
  { label: "Settings", href: ROUTES.settings, icon: "Settings" },
] as const;

export const PAGINATION_DEFAULT_PAGE_SIZE = 20;

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

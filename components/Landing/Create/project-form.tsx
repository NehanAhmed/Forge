"use client";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
// Ensure this path exists or update it to your actual server action location
import { createProject } from "@/lib/actions/projects.action";
import { IconLoader2 } from "@tabler/icons-react";


const loadingStates = [
  {
    text: "Waking up the AI",
  },
  {
    text: "Starting the Burner",
  },
  {
    text: "Analyzing the User Request",
  },
  {
    text: "Crafting the Plan",
  },
  {
    text: "Identifying the Risk and Analyzing the idea.",
  },
  {
    text: "Creating a Battle-Tested Plan",
  },
  {
    text: "Just a few Moments",
  },
  {
    text: "Here it Goes.",
  },
];

// Helper to handle HTML input (string) -> Number conversion safely
// This accepts string (from input), number (from default values), or undefined
const numericInput = z
  .union([z.string(), z.number(), z.null()])
  .transform((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  });

const projectSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must be less than 255 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description is too long"),
  problemStatement: z
    .string()
    .min(10, "Problem statement must be at least 10 characters")
    .max(5000, "Problem statement is too long"),
  targetUsers: numericInput.pipe(
    z.number().min(1, "Must have at least 1 target user").max(1000000000, "Target users seems unrealistic").optional()
  ),
  teamSize: numericInput.pipe(
    z.number().min(1, "Team size must be at least 1").max(1000, "Team size must be less than 1000").optional()
  ),
  timelineWeeks: numericInput.pipe(
    z.number().min(1, "Timeline must be at least 1 week").max(520, "Timeline must be less than 10 years").optional()
  ),
  budgetRange: z.string().optional(),
  isPublic: z.boolean().default(true),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

/**
 * Render a project creation form with validation and submission handling.
 *
 * The form collects basic information, optional project details, and visibility settings;
 * it validates input using the defined schema, submits data to the server, shows success or error toasts,
 * and navigates to the created project's page when available.
 *
 * @returns A React element that renders the project creation form and related UI.
 */
export function ProjectForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    // Explicitly casting default values to handle the optional fields correctly
    defaultValues: {
      isPublic: true,
      title: "",
      description: "",
      problemStatement: "",
      // These are strictly typed as undefined initially to match the schema's optional nature
      targetUsers: undefined,
      teamSize: undefined,
      timelineWeeks: undefined,
      budgetRange: undefined,
    },
  });

  const isPublic = watch("isPublic");

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);

    try {
      // Assuming createProject expects { data: ProjectFormValues }
      const result = await createProject({ data });

      toast.success("Project created successfully!", {
        description: "Your project has been created and saved.",
      });

      // Handle redirect safely
      if (result?.slug) {
        router.push(`/projects/${result.slug}`);
      } else {
        // Fallback if slug isn't returned, though ideally it should be
        router.refresh();
      }
    } catch (error: any) {
      console.error("Project creation error:", error);
      toast.error("Failed to create project", {
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-10  py-10 w-full ">

      <Loader loadingStates={loadingStates} loading={isSubmitting} duration={100} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 grid grid-cols-2 gap-4">
        {/* Basic Information Section */}
        <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="font-hanken-grotesk text-xl font-semibold">
              Basic Information
            </h2>
            <p className="text-muted-foreground text-sm">
              Tell us about your project
            </p>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Project Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                disabled={isSubmitting}
                placeholder="e.g., AI-Powered Task Manager"
                {...register("title")}
                aria-invalid={!!errors.title}
                className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.title && (
                <p className="text-destructive text-sm font-medium">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                disabled={isSubmitting}
                placeholder="Provide a detailed description of your project..."
                rows={4}
                {...register("description")}
                aria-invalid={!!errors.description}
                className={errors.description ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.description && (
                <p className="text-destructive text-sm font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Problem Statement */}
            <div className="space-y-2">
              <Label htmlFor="problemStatement" className="text-sm font-medium">
                Problem Statement <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="problemStatement"
                disabled={isSubmitting}
                placeholder="What problem does this project solve?"
                rows={4}
                {...register("problemStatement")}
                aria-invalid={!!errors.problemStatement}
                className={errors.problemStatement ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.problemStatement && (
                <p className="text-destructive text-sm font-medium">
                  {errors.problemStatement.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Project Details Section */}
        <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="font-hanken-grotesk text-xl font-semibold">
              Project Details
            </h2>
            <p className="text-muted-foreground text-sm">
              Optional information about scope and resources
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Target Users */}
            <div className="space-y-2">
              <Label htmlFor="targetUsers" className="text-sm font-medium">
                Target Users
              </Label>
              <Input
                id="targetUsers"
                type="number"
                disabled={isSubmitting}
                placeholder="e.g., 10000"
                {...register("targetUsers")}
                className={errors.targetUsers ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.targetUsers && (
                <p className="text-destructive text-sm font-medium">
                  {errors.targetUsers.message}
                </p>
              )}
            </div>

            {/* Team Size */}
            <div className="space-y-2">
              <Label htmlFor="teamSize" className="text-sm font-medium">
                Team Size
              </Label>
              <Input
                id="teamSize"
                type="number"
                disabled={isSubmitting}
                placeholder="e.g., 5"
                {...register("teamSize")}
                className={errors.teamSize ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.teamSize && (
                <p className="text-destructive text-sm font-medium">
                  {errors.teamSize.message}
                </p>
              )}
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <Label htmlFor="timelineWeeks" className="text-sm font-medium">
                Timeline (weeks)
              </Label>
              <Input
                id="timelineWeeks"
                type="number"
                disabled={isSubmitting}
                placeholder="e.g., 12"
                {...register("timelineWeeks")}
                className={errors.timelineWeeks ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.timelineWeeks && (
                <p className="text-destructive text-sm font-medium">
                  {errors.timelineWeeks.message}
                </p>
              )}
            </div>

            {/* Budget Range */}
            <div className="space-y-2">
              <Label htmlFor="budgetRange" className="text-sm font-medium">
                Budget Range
              </Label>
              <Select
                disabled={isSubmitting}
                onValueChange={(value) => setValue("budgetRange", value, { shouldValidate: true })}
              >
                <SelectTrigger className={errors.budgetRange ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-5k">$0 - $5,000</SelectItem>
                  <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                  <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                  <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                  <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                  <SelectItem value="100k+">$100,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Visibility Section */}
        <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm col-span-2">
          <div className="space-y-1">
            <h2 className="font-hanken-grotesk text-xl font-semibold">
              Visibility
            </h2>
            <p className="text-muted-foreground text-sm">
              Control who can see your project
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isPublic" className="text-base font-medium">
                Public Project
              </Label>
              <p className="text-muted-foreground text-sm">
                {isPublic
                  ? "Anyone can view this project"
                  : "Only you can view this project"}
              </p>
            </div>
            <Switch
              id="isPublic"
              disabled={isSubmitting}
              checked={isPublic}
              onCheckedChange={(checked) => setValue("isPublic", checked)}
            />
          </div>
          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-32">
              {isSubmitting ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </div>


      </form>
    </div>
  );
}
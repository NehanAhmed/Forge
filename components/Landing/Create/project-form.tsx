"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// UI Components
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Icons (Tabler)
import {
  IconLoader2,
  IconSparkles,
  IconAlignLeft,
  IconTarget,
  IconUsers,
  IconCalendar,
  IconWallet,
  IconWorld,
  IconLock
} from "@tabler/icons-react";

// Server Action
import { createProject } from "@/lib/actions/projects.action";
import { Separator } from "@/components/ui/separator";

// --- Configuration ---

const loadingStates = [
  { text: "Initializing Project Protocols..." },
  { text: "Analyzing User Intent & Scope..." },
  { text: "Waking up the AI Architect..." },
  { text: "Generating Tech Stack Recommendations..." },
  { text: "Drafting Database Schema..." },
  { text: "Identifying Potential Risks..." },
  { text: "Finalizing Roadmap & Milestones..." },
  { text: "Project Successfully Created." },
];

// --- Fixed Schema Definition ---
// We use z.preprocess to safely handle the HTML input behavior where 
// an empty field is an empty string "". This converts "" to undefined 
// BEFORE Zod tries to validate it as a number.

const projectSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(255, { message: "Title must be less than 255 characters" }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(5000, { message: "Description is too long" }),

  problemStatement: z
    .string()
    .min(10, { message: "Problem statement must be at least 10 characters" })
    .max(5000, { message: "Problem statement is too long" }),

  targetUsers: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().min(1, { message: "Must have at least 1 target user" }).max(1000000000).optional()
  ),

  teamSize: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().min(1, { message: "Team size must be at least 1" }).max(1000).optional()
  ),

  timelineWeeks: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().min(1, { message: "Timeline must be at least 1 week" }).max(520).optional()
  ),

  budgetRange: z.string().optional(),

  isPublic: z.boolean(),
});

// Derived types for React Hook Form + Zod resolver
// - ProjectFormInput is the raw form values before Zod preprocessing
// - ProjectFormValues is the parsed/validated output used in onSubmit

type ProjectFormSchema = typeof projectSchema;
type ProjectFormInput = z.input<ProjectFormSchema>;
type ProjectFormValues = z.output<ProjectFormSchema>;

export function ProjectForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<ProjectFormInput, any, ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      problemStatement: "",
      isPublic: true,
      // Setting these to undefined ensures the inputs start empty
      targetUsers: undefined,
      teamSize: undefined,
      timelineWeeks: undefined,
      budgetRange: undefined,
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = form;

  const titleValue = watch("title");
  const descriptionValue = watch("description");
  const problemValue = watch("problemStatement");
  const isPublic = watch("isPublic");

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);

    // Simulate initial delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // 1. Prepare Data
      // The z.preprocess in the schema has already handled the number conversion
      // and undefined logic, so 'data' is already strictly typed.
      const cleanedData = {
        title: data.title,
        description: data.description,
        problemStatement: data.problemStatement,
        isPublic: data.isPublic,
        targetUsers: data.targetUsers,
        teamSize: data.teamSize,
        timelineWeeks: data.timelineWeeks,
        budgetRange: data.budgetRange,
      };

      // 2. Call Server Action
      const result = await createProject({ data: cleanedData });
      if(!result.success){
        toast.error("An Error Occured.")
        return
      }
      toast.success("Project Initiated", {
        description: "Your project structure has been generated successfully.",
        duration: 4000,
      });

      if (result?.project.slug) {
        router.prefetch(`/p/${result.project.slug}`);
        router.push(`/p/${result.project.slug}`);
      } else {
        router.refresh();
      }
    } catch (error: unknown) {
      console.error("Project creation error:", error);
      toast.error("Generation Failed", {
        description: error instanceof Error ? error.message : "Could not create project. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-full  p-6 md:p-10 font-hanken-grotesk flex  gap-10">
      <Loader
        loadingStates={loadingStates}
        loading={isSubmitting}
        duration={8000}
        loop={false}
      />



      <form onSubmit={handleSubmit(onSubmit)} className="w-full  space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ">

        <div className="grid grid-cols-1 lg:grid-cols-13 gap-8">

          {/* LEFT COLUMN: Core Information */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-border/50 shadow-sm transition-all hover:border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <IconSparkles className="h-5 w-5" />
                  <CardTitle>Core Concept</CardTitle>
                </div>
                <CardDescription>
                  The foundation of your application. Be specific to get better AI suggestions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Title */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="title" className="text-sm font-semibold">Project Title <span className="text-destructive">*</span></Label>
                    <span className={cn("text-xs", (titleValue?.length || 0) > 200 ? "text-destructive" : "text-muted-foreground")}>
                      {titleValue?.length || 0}/255
                    </span>
                  </div>
                  <Input
                    id="title"
                    disabled={isSubmitting}
                    placeholder="e.g., Nexus: AI-Powered Supply Chain Optimizer"
                    className={cn("h-12 text-lg transition-all focus-visible:ring-2", errors.title && "border-destructive focus-visible:ring-destructive/30")}
                    {...register("title")}
                  />
                  {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
                      <IconAlignLeft className="h-3.5 w-3.5" /> Description <span className="text-destructive">*</span>
                    </Label>
                    <span className="text-xs text-muted-foreground">{descriptionValue?.length || 0}/5000</span>
                  </div>
                  <Textarea
                    id="description"
                    disabled={isSubmitting}
                    placeholder="Describe what the application does, who it's for, and its main value proposition..."
                    className={cn("min-h-[140px] resize-y bg-muted/30 focus:bg-background transition-colors", errors.description && "border-destructive")}
                    {...register("description")}
                  />
                  {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
                </div>

                {/* Problem Statement */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="problemStatement" className="text-sm font-semibold flex items-center gap-2">
                      <IconTarget className="h-3.5 w-3.5" /> Problem Statement <span className="text-destructive">*</span>
                    </Label>
                    <span className="text-xs text-muted-foreground">{problemValue?.length || 0}/5000</span>
                  </div>
                  <Textarea
                    id="problemStatement"
                    disabled={isSubmitting}
                    placeholder="What specific pain point are you solving? (e.g. 'Small businesses struggle to track inventory across multiple locations...')"
                    className={cn("min-h-[140px] resize-y bg-muted/30 focus:bg-background transition-colors", errors.problemStatement && "border-destructive")}
                    {...register("problemStatement")}
                  />
                  {errors.problemStatement && <p className="text-destructive text-sm">{errors.problemStatement.message}</p>}
                </div>

              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Details & Config */}
          <div className="lg:col-span-5 space-y-6">

            {/* Project Specs Card */}
            <Card className="border-border/50 shadow-sm h-fit">
              <CardHeader>
                <CardTitle className="text-lg">Project Scope</CardTitle>
                <CardDescription>
                  Optional details to help refine the implementation plan.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">

                {/* Target Users */}
                <div className="space-y-2">
                  <Label htmlFor="targetUsers" className="flex items-center gap-2 text-sm font-medium">
                    <IconUsers className="h-4 w-4 text-muted-foreground" />
                    Est. Target Users
                  </Label>
                  <Input
                    id="targetUsers"
                    type="number"
                    min="0"
                    disabled={isSubmitting}
                    placeholder="e.g. 10000"
                    {...register("targetUsers")}
                  />
                  {errors.targetUsers && <p className="text-destructive text-xs">{errors.targetUsers.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Team Size */}
                  <div className="space-y-2">
                    <Label htmlFor="teamSize" className="flex items-center gap-2 text-sm font-medium">
                      <IconUsers className="h-4 w-4 text-muted-foreground" />
                      Team Size
                    </Label>
                    <Input
                      id="teamSize"
                      type="number"
                      min="1"
                      disabled={isSubmitting}
                      placeholder="e.g. 5"
                      {...register("teamSize")}
                    />
                    {errors.teamSize && <p className="text-destructive text-xs">{errors.teamSize.message}</p>}
                  </div>

                  {/* Timeline */}
                  <div className="space-y-2">
                    <Label htmlFor="timelineWeeks" className="flex items-center gap-2 text-sm font-medium">
                      <IconCalendar className="h-4 w-4 text-muted-foreground" />
                      Weeks
                    </Label>
                    <Input
                      id="timelineWeeks"
                      type="number"
                      min="1"
                      disabled={isSubmitting}
                      placeholder="e.g. 12"
                      {...register("timelineWeeks")}
                    />
                    {errors.timelineWeeks && <p className="text-destructive text-xs">{errors.timelineWeeks.message}</p>}
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <Label htmlFor="budgetRange" className="flex items-center gap-2 text-sm font-medium">
                    <IconWallet className="h-4 w-4 text-muted-foreground" />
                    Budget Range
                  </Label>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={(value) => setValue("budgetRange", value)}
                    value={watch("budgetRange")} // Bind value for controlled component behavior
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select estimated budget" />
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
              </CardContent>
            </Card>

            {/* Visibility Card */}
            <Card className={cn(
              "border-border/50 transition-colors",
              isPublic ? "bg-muted/10" : "bg-muted/30 border-secondary/50"
            )}>
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {isPublic ? <IconWorld className="h-4 w-4 text-primary" /> : <IconLock className="h-4 w-4 text-secondary" />}
                      <Label htmlFor="isPublic" className="text-base font-semibold">
                        {isPublic ? "Public Project" : "Private Project"}
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isPublic
                        ? "Visible to the community. Others can fork this."
                        : "Only visible to you and your team."}
                    </p>
                  </div>
                  <Switch
                    id="isPublic"
                    disabled={isSubmitting}
                    checked={isPublic}
                    onCheckedChange={(checked) => setValue("isPublic", checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || !isValid}
                className={cn(
                  "w-full text-base font-semibold shadow-lg transition-all",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  "bg-gradient-to-r from-primary to-primary/80 hover:to-primary"
                )}
              >
                {isSubmitting ? (
                  <>
                    <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <IconSparkles className="mr-2 h-5 w-5" />
                    Create & Generate
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={() => router.back()}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            </div>

          </div>
        </div>
      </form>
     
    </div>
  );
}
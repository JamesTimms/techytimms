import { z } from "astro/zod";

export const workExperienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  location: z.string().min(1),
  description: z.array(z.string().min(1)).min(1),
});

export const skillGroupSchema = z.object({
  category: z.enum(["Core", "Strong", "Working"]),
  skills: z.array(z.string().min(1)).min(1),
});

export const educationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  period: z.string().min(1),
});

export const certificationSchema = z.object({
  name: z.string().min(1),
  year: z.string().regex(/^\d{4}$/, "Expected a four-digit year"),
});

export const achievementSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
});

export const cvSchema = z.object({
  about: z.array(z.string().min(1)).min(1),
  skills: z.array(skillGroupSchema).min(1),
  experience: z.array(workExperienceSchema).min(1),
  education: z.array(educationSchema).min(1),
  certifications: z.array(certificationSchema),
  achievements: z.array(achievementSchema),
});

export type Cv = z.infer<typeof cvSchema>;
export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import type {
  GenerateScriptRequest,
  GenerateScriptResponse,
  GenerateVideoRequest,
} from "../types";

// ─── Script Generation ────────────────────────────────────────────────────────

export function useGenerateScript() {
  return useMutation<GenerateScriptResponse, Error, GenerateScriptRequest>({
    mutationFn: async (payload) => {
      const { data } = await axios.post<GenerateScriptResponse>(
        "/api/projects/script/generate",
        payload,
      );
      return data;
    },
  });
}

// ─── Save Script (manual mode) ────────────────────────────────────────────────

export function useSaveScript() {
  return useMutation<
    { projectId: string },
    Error,
    {
      projectId: string | null;
      title: string;
      language: string;
      script: string;
      duration: string;
    }
  >({
    mutationFn: async (payload) => {
      if (payload.projectId) {
        const { data } = await axios.patch(
          `/api/projects/${payload.projectId}/script`,
          {
            script: payload.script,
          },
        );
        return data;
      } else {
        const { data } = await axios.post("/api/projects", payload);
        return data;
      }
    },
  });
}

// ─── Create Project ───────────────────────────────────────────────────────────

export function useCreateProject() {
  return useMutation<
    { projectId: string },
    Error,
    { title: string; language: string; prompt?: string; duration: string }
  >({
    mutationFn: async (payload) => {
      const { data } = await axios.post("/api/projects", payload);
      return data;
    },
  });
}

// ─── Generate Video ───────────────────────────────────────────────────────────

export function useGenerateVideo() {
  return useMutation<
    { jobId: string; estimatedTime: number },
    Error,
    GenerateVideoRequest
  >({
    mutationFn: async (payload) => {
      const { data } = await axios.post(
        "/api/projects/video/generate",
        payload,
      );
      return data;
    },
  });
}

// ─── Get Project (optional, for resuming) ─────────────────────────────────────

export function useProject(projectId: string | null) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/${projectId}`);
      return data;
    },
    enabled: !!projectId,
  });
}

// ─── Get Script Versions ──────────────────────────────────────────────────────

export function useScriptVersions(projectId: string | null) {
  return useQuery({
    queryKey: ["script-versions", projectId],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/projects/${projectId}/script/versions`,
      );
      return data;
    },
    enabled: !!projectId,
  });
}

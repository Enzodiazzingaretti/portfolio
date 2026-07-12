import { useMemo } from "react";
import { resolvePublicAsset } from "../utils/helpers";

export function useProjectDetails(content) {
  const webProjectDetails = useMemo(
    () =>
      content.webProjects.map((project) => ({
        title: project.title,
        subtitle: project.type,
        description: project.description,
        tags: project.tags ?? [],
        features: project.features ?? [],
        status: project.status,
        year: project.year,
        role: project.role,
        previewUrl: project.previewUrl,
        thumbnail: project.imageUrl
          ? resolvePublicAsset(project.imageUrl)
          : project.previewImage
            ? resolvePublicAsset(project.previewImage)
            : null,
        previewImage: project.previewImage ? resolvePublicAsset(project.previewImage) : null,
        slides: (project.slides?.length ? project.slides : []).filter(Boolean).map(resolvePublicAsset),
      })),
    [content.webProjects],
  );

  const loopDetails = useMemo(
    () =>
      content.touchDesignerLoops.map((loop) => ({
        title: loop.name,
        subtitle: content.ui.touchDesignerLoop,
        description: loop.notes,
        tags: ["touchdesigner", "generative", "live visuals"],
        thumbnail: loop.thumbnail
          ? resolvePublicAsset(loop.thumbnail)
          : loop.slides?.[0]
            ? resolvePublicAsset(loop.slides[0])
            : null,
        slides: (loop.slides?.length ? loop.slides : []).filter(Boolean).map(resolvePublicAsset),
      })),
    [content.touchDesignerLoops, content.ui.touchDesignerLoop],
  );

  const blenderDetails = useMemo(
    () =>
      content.blenderWorks.map((work) => ({
        title: work.title,
        subtitle: content.ui.blenderRender,
        description: work.description,
        tags: content.ui.renderTags,
        portrait: work.portrait ?? false,
        square: work.square ?? false,
        thumbnail: work.slides?.[0] ? resolvePublicAsset(work.slides[0]) : null,
        slides: (work.slides?.length ? work.slides : []).map(resolvePublicAsset),
      })),
    [content.blenderWorks, content.ui.blenderRender, content.ui.renderTags],
  );

  return { webProjectDetails, loopDetails, blenderDetails };
}

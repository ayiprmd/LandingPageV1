import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';

export function ProjectPreviewModal({ project, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedExpandedImage, setSelectedExpandedImage] = useState(null);
  const [mounted, setMounted] = useState(false);

  const images = project?.images ?? [];
  const hasMultiple = images.length > 1;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!project) return undefined;

    setCurrentIndex(0);
    setSelectedExpandedImage(null);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [project]);

  useEffect(() => {
    if (!project) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (selectedExpandedImage) {
          setSelectedExpandedImage(null);
          return;
        }
        onClose();
        return;
      }

      if (selectedExpandedImage) return;

      if (event.key === 'ArrowLeft' && hasMultiple) {
        setCurrentIndex((index) => (index - 1 + images.length) % images.length);
      }
      if (event.key === 'ArrowRight' && hasMultiple) {
        setCurrentIndex((index) => (index + 1) % images.length);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose, hasMultiple, images.length, selectedExpandedImage]);

  if (!mounted || !project) return null;

  const goPrev = (event) => {
    event.stopPropagation();
    setCurrentIndex((index) => (index - 1 + images.length) % images.length);
  };

  const goNext = (event) => {
    event.stopPropagation();
    setCurrentIndex((index) => (index + 1) % images.length);
  };

  const closeLightbox = () => setSelectedExpandedImage(null);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-preview-title"
      data-testid="project-preview-modal"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        aria-label="Close project preview"
        onClick={onClose}
        data-testid="project-preview-backdrop"
      />

      <div className="relative z-10 flex w-full max-w-4xl max-h-[85vh] flex-col overflow-hidden rounded-md border border-[#302938] bg-[#14111b] shadow-2xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#302938] px-5 py-4 md:px-6">
          <div className="min-w-0">
            <p className="mono text-[9px] uppercase tracking-[.2em] text-[#a65ee8]">
              {project.number} / {project.label}
            </p>
            <h3
              id="project-preview-title"
              className="mt-2 text-xl font-semibold uppercase tracking-[-.04em] text-[#e9e5dd] md:text-2xl"
            >
              {project.title}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#8c8591]">
              {project.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center border border-[#37313f] text-[#eeeae4] transition-colors hover:border-[#b76cf4] hover:text-[#b76cf4] cursor-pointer"
            aria-label="Close"
            data-testid="button-close-project-preview"
          >
            <X size={16} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6">
          {/* Mobile carousel */}
          <div className="md:hidden">
            {images.length > 0 ? (
              <div className="relative overflow-hidden rounded-md border border-[#302938] bg-[#0e0c13]">
                <button
                  type="button"
                  onClick={() => setSelectedExpandedImage(images[currentIndex])}
                  className="group block w-full cursor-pointer"
                  aria-label={`Expand ${project.title} preview ${currentIndex + 1}`}
                >
                  <img
                    src={images[currentIndex]}
                    alt={`${project.title} preview ${currentIndex + 1}`}
                    className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.02] group-hover:brightness-110"
                  />
                </button>

                {hasMultiple && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center border border-[#37313f] bg-[#14111b]/85 text-[#eeeae4] backdrop-blur-sm cursor-pointer"
                      aria-label="Previous image"
                      data-testid="button-carousel-prev"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center border border-[#37313f] bg-[#14111b]/85 text-[#eeeae4] backdrop-blur-sm cursor-pointer"
                      aria-label="Next image"
                      data-testid="button-carousel-next"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <span className="mono pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-sm bg-[#100e16]/80 px-2 py-1 text-[9px] uppercase tracking-[.14em] text-[#c9c2d1]">
                      {currentIndex + 1} / {images.length}
                    </span>
                  </>
                )}
              </div>
            ) : (
              <div className="grid aspect-[16/10] place-items-center rounded-md border border-[#302938] bg-[#0e0c13] text-sm text-[#716a78]">
                No preview available
              </div>
            )}
          </div>

          {/* Desktop grid with internal scroll via parent */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-3">
            {images.length > 0 ? (
              images.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setSelectedExpandedImage(src)}
                  className="group overflow-hidden rounded-md border border-[#302938] bg-[#0e0c13] cursor-pointer text-left"
                  aria-label={`Expand ${project.title} preview ${index + 1}`}
                >
                  <img
                    src={src}
                    alt={`${project.title} preview ${index + 1}`}
                    className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.03] group-hover:brightness-110"
                  />
                </button>
              ))
            ) : (
              <div className="col-span-2 grid aspect-[16/10] place-items-center rounded-md border border-[#302938] bg-[#0e0c13] text-sm text-[#716a78]">
                No preview available
              </div>
            )}
          </div>
        </div>

        {(project.github || project.demo) && (
          <div className="flex shrink-0 flex-wrap gap-3 border-t border-[#302938] px-5 py-4 md:px-6">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 border border-[#a65ee8] px-4 py-2.5 text-[10px] uppercase tracking-[.14em] text-[#d7a0fa] transition-all hover:bg-[#a65ee8] hover:text-[#100e16]"
                data-testid="link-project-github"
              >
                View on GitHub
                <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 border border-[#8b8493] px-4 py-2.5 text-[10px] uppercase tracking-[.14em] text-[#eeeae4] transition-all hover:border-[#b76cf4] hover:bg-[#b76cf4] hover:text-[#100e16]"
                data-testid="link-project-demo"
              >
                Live Demo
                <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {selectedExpandedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded project image"
          data-testid="project-image-lightbox"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-pointer"
            aria-label="Close expanded image"
            onClick={closeLightbox}
            data-testid="lightbox-backdrop"
          />

          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center border border-[#37313f] bg-[#14111b]/80 text-[#eeeae4] transition-colors hover:border-[#b76cf4] hover:text-[#b76cf4] cursor-pointer md:right-6 md:top-6"
            aria-label="Close lightbox"
            data-testid="button-close-lightbox"
          >
            <X size={18} />
          </button>

          <img
            src={selectedExpandedImage}
            alt={`${project.title} full preview`}
            className="relative z-10 max-h-[90vh] max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>,
    document.body,
  );
}

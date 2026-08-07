export type ImagePreloader = (src: string | undefined) => Promise<void>;

export function createImagePreloader(): ImagePreloader {
  const pendingImages = new Map<string, Promise<void>>();

  return (src) => {
    if (!src) return Promise.resolve();

    const pending = pendingImages.get(src);
    if (pending) return pending;

    const imageLoad = new Promise<void>((resolve) => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = src;
    });

    pendingImages.set(src, imageLoad);
    return imageLoad;
  };
}

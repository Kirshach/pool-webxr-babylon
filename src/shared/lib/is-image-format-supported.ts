type ImageFormat = "avif" | "webp";

export const isFormatSupported = (format: ImageFormat, dataUri: string) =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.src = `data:image/${format};base64,${dataUri}`;

    image.onload = () => {
      resolve(true);
    };

    image.onerror = () => {
      reject(format.toUpperCase() + "format not supported");
    };
  });

export const supportsAvif = await isFormatSupported(
  "avif",
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
);

export const supportsWebP = await isFormatSupported(
  "webp",
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
);

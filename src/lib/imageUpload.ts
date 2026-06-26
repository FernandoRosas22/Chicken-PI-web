const MAX_BASE64_SIZE = 700 * 1024; // 700KB, para quedar bajo el límite de 1MB por doc de Firestore

/**
 * Convierte un archivo de imagen a base64, redimensionando y comprimiendo
 * progresivamente hasta quedar bajo MAX_BASE64_SIZE.
 */
export function fileToCompressedBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let quality = 0.85;
        let maxDimension = 1000;

        const tryCompress = (): string => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("No se pudo procesar la imagen.");
          ctx.drawImage(img, 0, 0, width, height);
          return canvas.toDataURL("image/jpeg", quality);
        };

        let result = tryCompress();

        // Si sigue siendo muy grande, bajamos calidad y dimensión progresivamente
        let attempts = 0;
        while (result.length > MAX_BASE64_SIZE && attempts < 8) {
          quality -= 0.1;
          if (quality < 0.4) {
            quality = 0.4;
            maxDimension = Math.max(400, maxDimension - 150);
          }
          result = tryCompress();
          attempts++;
        }

        if (result.length > MAX_BASE64_SIZE) {
          reject(
            new Error(
              "La imagen es demasiado grande incluso después de comprimirla. Probá con otra foto."
            )
          );
          return;
        }

        resolve(result);
      };
      img.onerror = () => reject(new Error("No se pudo leer la imagen."));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });
}

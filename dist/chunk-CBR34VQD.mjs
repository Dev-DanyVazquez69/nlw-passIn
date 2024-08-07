// src/utils/generate-slug.ts
var generateSlug = (text) => {
  return text.normalize("NFC").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
};

export {
  generateSlug
};

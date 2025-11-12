import { supabase } from "./supabaseClient";

export const uploadFileToStorage = async (
  bucket: string,
  file: File,
  pathPrefix = ""
) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${pathPrefix}${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true, cacheControl: "3600" });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return { filePath, publicUrl };
};


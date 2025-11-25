import getValue from "@/configs/constants";

export interface UploadResponse {
  data: {
    public_url: string;
  };
  message: string;
  success: boolean;
}

export async function uploadProfileImage(
  imageFile: File,
  jwt: string,
  targetUserId?: string
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    // Build URL with target_user_id parameter for admin uploads
    let uploadUrl = `${getValue("API")}upload/image?folder=profiles`;
    if (targetUserId) {
      uploadUrl += `&target_user_id=${targetUserId}`;
    }

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload error response:", errorText);

      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(
          `Image upload failed: ${errorJson.error?.message || response.statusText}`
        );
      } catch (e) {
        throw new Error(
          `Image upload failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
    }

    const result = await response.json();
    // Production: Remove success logging
    // console.log('✅ Upload successful:', result.message);

    // Backend returns the URL in the 'url' field
    if (result.url) {
      return result.url;
    } else {
      console.error("❌ No URL in response:", result);
      throw new Error("Upload response missing URL");
    }
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
}

export async function uploadProgramPhoto(
  imageFile: File,
  programId: string,
  jwt: string
): Promise<string> {
  try {
    validateImageFile(imageFile);

    const formData = new FormData();
    formData.append("image", imageFile);

    const uploadUrl = `${getValue("API")}upload/program-photo?program_id=${programId}`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Program photo upload error response:", errorText);

      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(
          `Image upload failed: ${errorJson.error?.message || response.statusText}`
        );
      } catch (e) {
        throw new Error(
          `Image upload failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
    }

    const result = await response.json();

    if (result.url) {
      return result.url;
    } else {
      console.error("❌ No URL in program photo upload response:", result);
      throw new Error("Upload response missing URL");
    }
  } catch (error) {
    console.error("Error uploading program photo:", error);
    throw error;
  }
}

export async function uploadTeamLogo(
  imageFile: File,
  jwt: string,
  teamId?: string
): Promise<string> {
  try {
    validateImageFile(imageFile);

    const formData = new FormData();
    formData.append("image", imageFile);

    let uploadUrl = `${getValue("API")}upload/image?folder=teams`;
    if (teamId) {
      uploadUrl += `&team_id=${teamId}`;
    }

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Team logo upload error response:", errorText);

      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(
          `Image upload failed: ${errorJson.error?.message || response.statusText}`
        );
      } catch (e) {
        throw new Error(
          `Image upload failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
    }

    const result = await response.json();

    if (result.url) {
      return result.url;
    } else {
      console.error("❌ No URL in team logo upload response:", result);
      throw new Error("Upload response missing URL");
    }
  } catch (error) {
    console.error("Error uploading team logo:", error);
    throw error;
  }
}

export function validateImageFile(file: File): void {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please use JPG, PNG, GIF, or WebP.");
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error("File too large. Maximum size is 10MB.");
  }
}

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import getValue from "@/configs/constants";

export interface AthleteRegistrationData {
  // Firebase account fields
  email: string;
  password: string;
  // Required API fields
  first_name: string;
  last_name: string;
  dob: string; // Format: "YYYY-MM-DD"
  // Optional API fields
  country_code?: string;
  gender?: "M" | "F";
  phone_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  has_consent_to_email_marketing?: boolean;
  has_consent_to_sms?: boolean;
  waivers?: Array<{
    is_waiver_signed: boolean;
    waiver_url: string;
  }>;
}

export async function registerAthlete(
  athleteData: AthleteRegistrationData,
  jwt: string
): Promise<{ error: string | null }> {
  let secondaryAuth: ReturnType<typeof getAuth> | null = null;

  try {
    // Step 1: Create Firebase account using a secondary app instance
    // This prevents logging out the current admin

    const firebaseConfig = {
      apiKey: "AIzaSyC3asIejQ5bP-29GhIZIO4CnlAZO0wETqQ",
      authDomain: "sacred-armor-452904-c0.firebaseapp.com",
      projectId: "sacred-armor-452904-c0",
      storageBucket: "sacred-armor-452904-c0.firebasestorage.app",
      messagingSenderId: "461776259687",
      appId: "1:461776259687:web:558026e90baef5a63522c2",
      measurementId: "G-9YPMC5DDB2",
    };

    let firebaseToken: string;

    try {
      // Create a secondary app with a unique name to avoid conflicts
      const secondaryApp = initializeApp(
        firebaseConfig,
        `secondary-athlete-${Date.now()}`
      );
      secondaryAuth = getAuth(secondaryApp);

      // Create user with the secondary auth instance
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        athleteData.email,
        athleteData.password
      );

      // Get the Firebase ID token from the newly created user
      firebaseToken = await userCredential.user.getIdToken();

      // Immediately sign out from the secondary auth to clean up
      await signOut(secondaryAuth);
    } catch (firebaseError: unknown) {
      console.error("Firebase account creation failed:", firebaseError);

      // Provide user-friendly error messages
      let errorMessage = "Failed to create account: ";
      const error = firebaseError as { code?: string; message?: string };

      if (error.code === "auth/email-already-in-use") {
        errorMessage += "This email is already registered.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage += "Invalid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage += "Password is too weak. Please use a stronger password.";
      } else {
        errorMessage += error.message || "Unknown error occurred";
      }

      return { error: errorMessage };
    }

    // Step 2: Register athlete in backend using the NEW USER'S Firebase token
    // Remove email and password from the request body
    const { email, password, ...apiData } = athleteData;

    const response = await fetch(`${getValue("API")}register/athlete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify(apiData),
    });

    const responseJSON = await response.json().catch(() => ({}));

    if (!response.ok) {
      let errorMessage = `Failed to register athlete: ${response.statusText}`;
      if (responseJSON.error?.message) {
        errorMessage = responseJSON.error.message;
      } else if (responseJSON.error) {
        errorMessage = String(responseJSON.error);
      } else if (responseJSON.message) {
        errorMessage = responseJSON.message;
      }

      errorMessage +=
        " (Note: Account was created but profile registration failed. The athlete can try logging in.)";
      return { error: errorMessage };
    }

    return { error: null };
  } catch (error) {
    console.error("Error registering athlete:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

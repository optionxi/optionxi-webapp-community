import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface RequestBody {
  name: string;
  email: string;
  mobileNumber: string;
  turnstileToken: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Check for authentication (example)
  const authToken = req.headers.authorization?.split(" ")[1];
  if (!authToken) {
    return res.status(401).json({ message: "Unauthorized: Missing authentication token" });
  }

  const { name, email, mobileNumber, turnstileToken }: RequestBody = req.body;

  // Validate Turnstile token
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY!;
  try {
    const response = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      new URLSearchParams({
        secret: secretKey,
        response: turnstileToken,
      })
    );

    if (!response.data.success) {
      return res.status(401).json({ message: "Turnstile verification failed" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to validate Turnstile token", error: err });
  }

  // Insert data into Supabase
  try {
    const { error } = await supabase.from("interest_people").insert([
      { name, email, mobileNumber },
    ]);

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        return res.status(409).json({
          message: "A submission already exists for this email or mobile number.",
        });
      }
      throw error;
    }

    return res.status(200).json({ message: "Thank you for your submission!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to save data." });
  }
}

"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_ENDPOINTS } from "@/app/config/api";

const getLineAccessToken = async (code) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "authorization_code");
  urlencoded.append("code", code);
  urlencoded.append("client_id", process.env.NEXT_PUBLIC_LINE_CLIENT_ID);
  urlencoded.append("client_secret", process.env.NEXT_PUBLIC_LINE_CLIENT_SECRET);
  urlencoded.append("redirect_uri", process.env.NEXT_PUBLIC_LINE_SIGNUP_REDIRECT_URI);

  try {
    const response = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: headers,
      body: urlencoded,
    });
    const result = await response.json();
    return result.access_token;
  } catch (error) {
    console.error("Error getting LINE token:", error);
    throw error;
  }
};

const getLineProfile = async (accessToken) => {
  try {
    const response = await fetch("https://api.line.me/v2/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error getting LINE profile:", error);
    throw error;
  }
};

const checkLineIdExists = async (lineId) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.users.checkLine}/${lineId}`, {
      method: "GET",
      headers: {
        "accept": "application/json"
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error checking LINE ID:", error);
    throw error;
  }
};

export default function LineSignupCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code || state !== "signup") {
        setError("Invalid signup attempt");
        return;
      }

      try {
        const accessToken = await getLineAccessToken(code);
        const profile = await getLineProfile(accessToken);
        
        // Check if LINE ID exists
        const checkResult = await checkLineIdExists(profile.userId);
        
        if (checkResult.status === 200) {
          // LINE ID exists - show error with user details
          const userData = checkResult.data;
          setError(
            `LINE ID นี้ได้ลงทะเบียนแล้ว\n` +
            `ชื่อผู้ใช้: ${userData.username}\n` +
            `ชื่อ-สกุล: ${userData.f_name} ${userData.l_name}`
          );
          return;
        }

        // LINE ID doesn't exist - proceed with signup
        router.push(
          `/signup?line_id=${profile.userId}&line_token=${accessToken}&display_name=${profile.displayName}`
        );
      } catch (error) {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับ LINE");
        console.error("LINE callback error:", error);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
            <div className="font-medium mb-2">ไม่สามารถลงทะเบียนได้</div>
            <pre className="whitespace-pre-wrap text-sm">
              {error}
            </pre>
          </div>
          <div className="mt-4 text-center">
            <a
              href="/signup"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              กลับไปหน้าลงทะเบียน
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">กำลังเชื่อมต่อกับ LINE...</p>
      </div>
    </div>
  );
}
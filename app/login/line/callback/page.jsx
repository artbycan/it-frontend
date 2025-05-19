"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_ENDPOINTS } from "@/app/config/api";

const getLineAccessToken = async (code) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "authorization_code");
  urlencoded.append("code", code);
  urlencoded.append("client_id", process.env.NEXT_PUBLIC_LINE_CLIENT_ID);
  urlencoded.append(
    "client_secret",
    process.env.NEXT_PUBLIC_LINE_CLIENT_SECRET
  );
  urlencoded.append("redirect_uri", process.env.NEXT_PUBLIC_LINE_REDIRECT_URI);

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

const checkLineFriendship = async (accessToken) => {
  try {
    const response = await fetch("https://api.line.me/friendship/v1/status", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await response.json();
    return result.friendFlag;
  } catch (error) {
    console.error("Error checking LINE friendship:", error);
    return false;
  }
};

export default function LineCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleLineCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code || state !== "line-login") {
        setError("Invalid login attempt");
        return;
      }

      try {
        // Get LINE access token
        const lineAccessToken = await getLineAccessToken(code);

        // Check friendship status
        const isFriend = await checkLineFriendship(lineAccessToken);

        if (!isFriend) {
          setError("กรุณาเพิ่มเพื่อนก่อนเข้าใช้งาน");
          return;
        }

        // Get LINE profile
        const lineProfile = await getLineProfile(lineAccessToken);
        //console.log("LINE Profile:", lineProfile);

        // Get user data from your backend
        const response = await fetch(API_ENDPOINTS.auth.lineLogin, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            line_id: lineProfile.userId,
          }),
        });

        const result = await response.json();
        if (result.status === 200) {
          const sessionResponse = await fetch("/api/auth/session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: result.data.jwt_token.access_token,
              user: {
                id: result.data.user_id,
                username: result.data.username,
                role: result.data.role,
                status: result.data.status,
                fullName: `${result.data.f_name} ${result.data.l_name}`,
              },
            }),
          });

          if (sessionResponse.ok) {
            localStorage.setItem("username", result.data.username);
            localStorage.setItem(
              "user_fullname",
              `${result.data.f_name} ${result.data.l_name}`
            );
            localStorage.setItem("user_id", result.data.user_id);
            localStorage.setItem(
              "jwt_token",
              result.data.jwt_token.access_token
            );
            router.push("/repair");
          }
        } else {
          setError(result.message || "เข้าสู่ระบบไม่สำเร็จ");
        }
      } catch (error) {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับ LINE");
        console.error("LINE callback error:", error);
      }
    };

    handleLineCallback();
  }, []);

  if (error) {
    if (error === "กรุณาเพิ่มเพื่อนก่อนเข้าใช้งาน") {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full space-y-4 p-6 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h2 className="text-xl font-bold text-red-600 mb-4">
                กรุณาเพิ่มเพื่อนก่อนเข้าใช้งาน
              </h2>
              <p className="text-gray-600 mb-4">
                กรุณาเพิ่มเพื่อน odpc1it เพื่อรับการแจ้งเตือนและข่าวสาร
              </p>
              <a
                href="https://line.me/R/ti/p/%40563nwglb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-[#00B900] text-white rounded-md hover:bg-[#009900]"
              >
                <img
                  src="https://cdn-icons-png.freepik.com/256/2335/2335324.png"
                  alt="LINE"
                  className="w-5 h-5 mr-2"
                />
                เพิ่มเพื่อน
              </a>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">กำลังเข้าสู่ระบบ...</p>
      </div>
    </div>
  );
}

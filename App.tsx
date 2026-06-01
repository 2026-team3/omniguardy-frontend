import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles/styles";

import CctvScreen from "./screens/CctvScreen";
import TtsSetting from "./screens/TtsSetting";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("CCTV");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
      const checkAutoLogin = async () => {
        try {
          const REFRESH_API_URL = "http://10.254.2.143:8080/api/auth/refresh";
          const response = await fetch(REFRESH_API_URL, {
            method: "POST",
            credentials: "include"
          });

          const result = await response.json();

          if (response.ok && result.success) {
            const newAccessToken = result.data.accessToken;
            setToken(newAccessToken); // 새 엑세스 토큰 세팅
            setIsLoggedIn(true);      // 로그인 상태 갱신
            console.log("자동 토큰 재발급 성공! 로그인 유지 완료.");
          }
        } catch (error) {
          console.log("기존 세션이 없거나 토큰 재발급에 실패했습니다.", error);
        }
      };
      checkAutoLogin();
    }, []); //  빈 배열을 주어 앱 시작 시점에 딱 한 번만 자동 실행

  const handleLogout = async () => {
    try {
          // 💡 만약 토큰이 없다면 굳이 서버를 안 찔러도 되므로 바로 프론트 상태 초기화
          if (!token) {
            setIsLoggedIn(false);
            setToken(null);
            setCurrentScreen("CCTV");
            setIsSidebarOpen(false);
            return;
          }
          const LOGOUT_API_URL = "http://10.254.2.143:8080/api/auth/logout";
          const response = await fetch(LOGOUT_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });

          if (response.ok) {
            console.log("백엔드 로그아웃 완료");
          } else {
            console.log("백엔드 로그아웃 실패 혹은 이미 만료된 토큰");
          }

        } catch (error) {
          console.error("로그아웃 통신 에러:", error);
        } finally {
          // 🔑 서버 결과와 상관없이 사용자 화면은 안전하게 로그아웃 처리 및 초기화
          setIsLoggedIn(false);
          setToken(null);
          setCurrentScreen("CCTV");
          setIsSidebarOpen(false);
          alert("로그아웃 되었습니다.");
        }
      };

  return (
    <View style={styles.phoneFrame}>
      {/* 사이드바 영역 */}
      {isSidebarOpen && (
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarMenuTitle}>메뉴</Text>
            <TouchableOpacity onPress={() => setIsSidebarOpen(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={[styles.sidebarItem, currentScreen === "CCTV" && { backgroundColor: "#2D2F35" }]}
              onPress={() => {
                setCurrentScreen("CCTV");
                setIsSidebarOpen(false);
              }}
            >
              <Text style={styles.sidebarItemText}>CCTV 영상 분석</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sidebarItem, currentScreen === "TTS" && { backgroundColor: "#2D2F35" }]}
              onPress={() => {
                setCurrentScreen("TTS");
                setIsSidebarOpen(false);
              }}
            >
              <Text style={styles.sidebarItemText}>음성 경고 설정</Text>
            </TouchableOpacity>
          </View>

          {/* 하단 로그인/로그아웃 버튼 영역 */}
          <View style={{ alignItems: "flex-end", marginTop: "auto", paddingBottom: 10 }}>
            {isLoggedIn ? (
              <TouchableOpacity onPress={handleLogout} style={{ padding: 5 }}>
                <Text style={{ color: "#aaa", fontSize: 13, fontWeight: "600" }}>로그아웃</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setCurrentScreen("LOGIN");
                  setIsSidebarOpen(false);
                }}
                style={{ padding: 5 }}
              >
                <Text style={{ color: "#aaa", fontSize: 14, fontWeight: "600" }}>로그인/회원가입</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <SafeAreaView style={styles.container}>
        {/* 상단 헤더 바 */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setIsSidebarOpen(true)} style={styles.hamburgerButton}>
            <Text style={styles.hamburgerIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>
            {currentScreen === "CCTV" && "OmniGuardy CCTV"}
            {currentScreen === "TTS" && "음성 경고 설정"}
            {currentScreen === "LOGIN" && "로그인"}
            {currentScreen === "SIGNUP" && "회원가입"}
          </Text>
          <View style={{ width: 32 }} />
        </View>

        {/* 화면 분기 조건부 렌더링 영역 - 유령 문자 제거 완료 */}
        {currentScreen === "CCTV" && <CctvScreen />}
        {currentScreen === "TTS" && <TtsSetting token={token} />}
        {currentScreen === "LOGIN" && (
          <LoginScreen
            setIsLoggedIn={setIsLoggedIn}
            setCurrentScreen={setCurrentScreen}
            setToken={setToken}
          />
        )}
        {currentScreen === "SIGNUP" && (
          <SignupScreen
            setIsLoggedIn={setIsLoggedIn}
            setCurrentScreen={setCurrentScreen}
            setToken={setToken}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
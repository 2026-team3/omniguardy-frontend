import React, { useState } from "react";
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setCurrentScreen("CCTV");
    setIsSidebarOpen(false);
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
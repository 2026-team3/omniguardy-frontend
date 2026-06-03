import React, { useState, useEffect, useRef } from "react"; // 👈 애니메이션 값 기억을 위해 useRef 추가
import { SafeAreaView, View, Text, TouchableOpacity, ActivityIndicator, Animated } from "react-native"; // 👈 Animated 추가
import { styles } from "./styles/styles";
import { Ionicons } from '@expo/vector-icons';

import CctvScreen from "./screens/CctvScreen";
import TtsSetting from "./screens/TtsSetting";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";

// 💡 사이드바의 가로 크기 정의
const SIDEBAR_WIDTH = 250;

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 1. [애니메이션 값 생성] 최초 시작 위치는 화면 왼쪽 바깥 (-250)
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  // 2. [화면 유지] 새로고침해도 보던 화면을 기억
  const [currentScreen, setCurrentScreen] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("currentScreen") || "CCTV";
    }
    return "CCTV";
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // 🔄 앱 시작 시 1회 실행: 로컬 스토리지에서 토큰을 꺼내서 즉시 로그인 복구
  useEffect(() => {
    const restoreLoginSession = () => {
      try {
        if (typeof window !== "undefined") {
          const savedToken = localStorage.getItem("accessToken");
          const savedScreen = localStorage.getItem("currentScreen");

          if (savedToken) {
            setToken(savedToken);
            setIsLoggedIn(true);
            console.log("프론트 단독 로컬 세션 복구 성공! 로그인 상태 유지 완료.");
          }
          if (savedScreen) {
            setCurrentScreen(savedScreen);
          }
        }
      } catch (error) {
        console.log("로컬 세션 복구 실패:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    restoreLoginSession();
  }, []);

  // 🔄 [추가] 사이드바 토글 상태(isSidebarOpen) 감지하여 부드럽게 밀어주는 리스너
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isSidebarOpen ? 0 : -SIDEBAR_WIDTH, // 열리면 원래자리(0), 닫히면 왼쪽 밖(-250)
      duration: 300, // 0.3초 동안 스르륵
      useNativeDriver: false, // 레이아웃 속성(left) 제어를 위해 false 유지
    }).start();
  }, [isSidebarOpen]);

  // 💡 화면 이동 및 로컬스토리지 동기화 함수
  const handleNavigation = (screenName: string) => {
    setCurrentScreen(screenName);
    setIsSidebarOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("currentScreen", screenName);
    }
  };

  // 🔑 [중요] 로그인 성공 시 호출될 전역 토큰 저장소 세팅 함수
  const handleLoginSuccess = (userToken: string) => {
    setToken(userToken);
    setIsLoggedIn(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", userToken);
    }
  };

  const handleLogout = async () => {
    try {
      if (!token) {
        cleanUpLogout();
        return;
      }
      const LOGOUT_API_URL = "http://10.254.2.143:8080/api/auth/logout";
      await fetch(LOGOUT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include"
      });
    } catch (error) {
      console.error("로그아웃 통신 에러:", error);
    } finally {
      cleanUpLogout();
    }
  };

  // 로그아웃 시 로컬 청소 함수
  const cleanUpLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    handleNavigation("CCTV");
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
    alert("로그아웃 되었습니다.");
  };

  if (isInitializing) {
    return (
      <View style={[styles.phoneFrame, { justifyContent: "center", alignItems: "center", backgroundColor: "#1E2024" }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ color: "#aaa", marginTop: 12, fontSize: 14 }}>보안 세션을 확인하는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.phoneFrame}>

      {/* 💡 [수정] 사이드바 영역: 뚝 끊기던 조건부 렌더링을 걷어내고, 항상 상주하되 Animated.View의 left 값으로 스르륵 밀어줍니다. */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            position: 'absolute',
            left: slideAnim, // 👈 애니메이션 실시간 좌표값 매핑
            width: SIDEBAR_WIDTH,
            zIndex: 999, // 메인 콘텐츠 레이어보다 무조건 위로 덮이도록 보장
            height: '100%'
          }
        ]}
      >
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarMenuTitle}>메뉴</Text>
          <TouchableOpacity onPress={() => setIsSidebarOpen(false)}>
            <Ionicons name="close-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }}>
          {/* CCTV 메뉴 아이템 (가로 정렬 및 간격 확보 완료) */}
          <TouchableOpacity
            style={[
              styles.sidebarItem,
              { flexDirection: "row", alignItems: "center" },
              currentScreen === "CCTV" && { backgroundColor: "#2D2F35" }
            ]}
            onPress={() => handleNavigation("CCTV")}
          >
            <Ionicons name="videocam-outline" size={20} color="#fff" />
            <Text style={[styles.sidebarItemText, { marginLeft: 10 }]}>CCTV 영상 분석</Text>
          </TouchableOpacity>

          {/* TTS 메뉴 아이템 (가로 정렬 및 간격 확보 완료) */}
          <TouchableOpacity
            style={[
              styles.sidebarItem,
              { flexDirection: "row", alignItems: "center" },
              currentScreen === "TTS" && { backgroundColor: "#2D2F35" }
            ]}
            onPress={() => handleNavigation("TTS")}
          >
            <Ionicons name="volume-high-outline" size={20} color="#fff" />
            <Text style={[styles.sidebarItemText, { marginLeft: 10 }]}>음성 경고 설정</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "flex-end", marginTop: "auto", paddingBottom: 10 }}>
          {isLoggedIn ? (
            <TouchableOpacity onPress={handleLogout} style={{ padding: 5, flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="log-out-outline" size={16} color="#aaa" style={{ marginRight: 4 }} />
              <Text style={{ color: "#aaa", fontSize: 13, fontWeight: "600" }}>로그아웃</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => handleNavigation("LOGIN")} style={{ padding: 5, flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="log-in-outline" size={16} color="#aaa" style={{ marginRight: 4 }} />
              <Text style={{ color: "#aaa", fontSize: 14, fontWeight: "600" }}>로그인/회원가입</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* 메인 콘텐츠 영역 */}
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setIsSidebarOpen(true)} style={styles.hamburgerButton}>
            <Ionicons name="menu-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>
            {currentScreen === "CCTV" && "OmniGuardy CCTV"}
            {currentScreen === "TTS" && "음성 경고 설정"}
            {currentScreen === "LOGIN" && "로그인"}
            {currentScreen === "SIGNUP" && "회원가입"}
          </Text>
          <View style={{ width: 32 }} />
        </View>

        {/* 화면 분기 조건부 렌더링 영역 */}
        {currentScreen === "CCTV" && <CctvScreen token={token} />}}
        {currentScreen === "TTS" && <TtsSetting token={token} />}
        {currentScreen === "LOGIN" && (
          <LoginScreen
            setIsLoggedIn={setIsLoggedIn}
            setCurrentScreen={handleNavigation}
            setToken={handleLoginSuccess}
          />
        )}
        {currentScreen === "SIGNUP" && (
          <SignupScreen
            setIsLoggedIn={setIsLoggedIn}
            setCurrentScreen={handleNavigation}
            setToken={handleLoginSuccess}
          />
        )}
      </SafeAreaView>
    </View>
  );
}
import AsyncStorage from "@react-native-async-storage/async-storage";

import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, ActivityIndicator, Animated, Platform } from "react-native";
import { styles } from "./styles/styles";
import { Ionicons } from '@expo/vector-icons';

import CctvScreen from "./screens/CctvScreen";
import TtsSetting from "./screens/TtsSetting";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";

const SIDEBAR_WIDTH = 250;
const BASE_URL = "http://10.215.74.143:8080";
const saveItem = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await AsyncStorage.setItem(key, value);
  }
};

const getItem = async (key: string) => {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return await AsyncStorage.getItem(key);
  }
};

const removeItem = async (key: string) => {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await AsyncStorage.removeItem(key);
  }
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  const [currentScreen, setCurrentScreen] = useState("LOGIN");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const handleNavigation = async (screenName: string) => {
    setCurrentScreen(screenName);
    setIsSidebarOpen(false);

    await saveItem("currentScreen", screenName);
  };

  const handleLoginSuccess = async (userToken: string) => {
    setToken(userToken);
    setIsLoggedIn(true);

    await saveItem("accessToken", userToken);
  };

  // 사용자가 우측 하단에서 직접 로그아웃 누를 때
  const cleanUpLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    handleNavigation("LOGIN");

    removeItem("accessToken");
    removeItem("currentScreen");
    alert("로그아웃 되었습니다.");
  };


  const cleanUpLogoutSilent = () => {
    setIsLoggedIn(false);
    setToken(null);
    handleNavigation("LOGIN");

    removeItem("accessToken");
    removeItem("currentScreen");
  };

  // 🔄 앱 최초 구동 및 새로고침 시 서버 상태 실시간 검증
  useEffect(() => {
    const verifyServerSession = async () => {
      try {
        const savedToken = await getItem("accessToken");
        const savedScreen = await getItem("currentScreen");

        if (!savedToken) {
          handleNavigation("LOGIN");
          setIsInitializing(false);
          return;
        }

        if (savedScreen) {
          setCurrentScreen(savedScreen);
        }

          console.log("🔄 로컬 토큰 발견, 서버 검증 시작...");

          // 스프링부트 서버 인증 상태 체크
          const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${savedToken}`
            },
            credentials: "include"
          });

          // 💡 [핵심 교정] 단순 새로고침 시 401이 나더라도 로컬 토큰이 있으면 로그인 유지!
          // 서버가 살아있다는 증거이므로 로그아웃 시키지 않고 로그인 상태를 복구합니다.
          if (response.status === 401 || response.ok) {
            console.log("🟢 서버 가동 중 확인 - 로그인 상태를 유지합니다.");
            setToken(savedToken);
            setIsLoggedIn(true);
            if (savedScreen) setCurrentScreen(savedScreen);

            // 만약 서버에서 새 토큰을 정상적으로 받아왔다면 교체 유연성 확보
            if (response.ok) {
              const result = await response.json();
              if (result.success && result.data?.accessToken) {
                 setToken(result.data.accessToken);
                 await saveItem("accessToken", result.data.accessToken);
              }
            }
          } else {
          // 401 외에 의도치 않은 다른 에러코드(500 등)가 올 때만 로그아웃
            console.log(`❌ 서버 에러 응답 (Status: ${response.status}) -> 자동 로그아웃`);
            cleanUpLogoutSilent();
          }

      } catch (error) {
        console.log("🚨 백엔드 서버가 리셋되었거나 꺼져있음: 로그인 화면으로 강제 이동 및 토큰 폐기");
        cleanUpLogoutSilent();
      } finally {
        setIsInitializing(false);
      }
    };

    verifyServerSession();
  }, []);

  // 사이드바 애니메이션 리스너
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isSidebarOpen ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isSidebarOpen]);

  // 백엔드 로그아웃 API 호출
  const handleLogout = async () => {
    try {
      if (!token) {
        cleanUpLogout();
        return;
      }
      await fetch(`${BASE_URL}/api/auth/logout`, {
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

      {/* 사이드바 영역 */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            position: 'absolute',
            left: slideAnim,
            width: SIDEBAR_WIDTH,
            zIndex: 999,
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

        <View style={{ alignItems: "flex-end", marginTop: "auto", paddingBottom: 20 }}>
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

        {currentScreen === "CCTV" && <CctvScreen token={token} />}
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
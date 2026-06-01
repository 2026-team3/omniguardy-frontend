import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles/styles";

// 💡 새로 만든 화면 컴포넌트들을 불러옵니다.
import CctvScreen from "./screens/CctvScreen";
import TtsSetting from "./screens/TtsSetting";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("CCTV");

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
      )}

      <SafeAreaView style={styles.container}>
        {/* 상단 헤더 바 */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setIsSidebarOpen(true)} style={styles.hamburgerButton}>
            <Text style={styles.hamburgerIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>
            {currentScreen === "CCTV" ? "OmniGuardy CCTV" : "음성 경고 설정"}
          </Text>
          <View style={{ width: 32 }} />
        </View>

        {/* 💡 어떤 화면을 보여줄지 분기만 해줍니다. 훨씬 깔끔하죠? */}
        {currentScreen === "CCTV" ? <CctvScreen /> : <TtsSetting />}
      </SafeAreaView>
    </View>
  );
}
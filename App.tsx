import React, {useState} from "react";
import { styles } from "./styles/styles";
import * as DocumentPicker from "expo-document-picker";
import { Video, ResizeMode } from "expo-av";

import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function App() {

  const visionScore = 72;
  const audioScore = 35;

  const [uploaded, setUploaded] = useState(false);
  const [videoUri, setVideoUri] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pickVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setVideoUri(uri);
      setUploaded(true);
      console.log(result.assets[0]);
    }
  };

  return (
  <View style={styles.phoneFrame}>
    {/* 2. 사이드바 컴포넌트 (phoneFrame 내부 absolute 배치) */}
    {isSidebarOpen && (
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarMenuTitle}>메뉴</Text>
            <TouchableOpacity onPress={() => setIsSidebarOpen(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
        </View>

        {/* 사이드바 메뉴 리스트 */}
        <TouchableOpacity style={styles.sidebarItem}>
          <Text style={styles.sidebarItemText}>🏠 CCTV 모니터링</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem}>
          <Text style={styles.sidebarItemText}>⚙️ 환경 설정</Text>
        </TouchableOpacity>
      </View>
    )}

    <SafeAreaView style={styles.container}>
      {/* 3. 상단 헤더 영역 (햄버거 버튼 추가) */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => setIsSidebarOpen(true)} style={styles.hamburgerButton}>
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>OmniGuardy AI</Text>
        <View style={{ width: 32 }} /> {/* 우측 밸런스를 위한 더미 공간 */}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>OmniGuardy AI</Text>
        <Text style={styles.subtitle}>1학기 시연용 Prototype</Text>

        {/* 영상 영역 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>CCTV 영상</Text>
            <TouchableOpacity
              style={[styles.uploadButton, uploaded && styles.analyzeButton]}
              onPress={pickVideo}
            >
              <Text style={styles.uploadButtonText}>
                {uploaded ? "영상 분석" : "영상 업로드"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.videoPlaceholder}>
            {videoUri ? (
              <Video
                source={{ uri: videoUri }}
                useNativeControls
                shouldPlay={false}
                isLooping
                resizeMode={ResizeMode.CONTAIN}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Text style={styles.placeholderText}>CCTV 영상 영역</Text>
            )}
          </View>
        </View>

        {/* 행동 감지 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>감지 행동</Text>
          <Text style={styles.behavior}>문 안쪽 확인 시도 (A20)</Text>
        </View>

        {/* 위험도 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>위험도 분석</Text>
          <Text style={styles.score}>Vision Score : {visionScore}</Text>
          <Text style={styles.score}>Audio Score : {audioScore}</Text>
        </View>

        {/* 최종 경고 */}
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>⚠ 위험 단계</Text>
          <Text style={styles.alertValue}>HIGH</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  </View>
  );
}


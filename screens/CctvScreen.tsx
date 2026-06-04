import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from "react-native";
import { Video, ResizeMode } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { styles } from "../styles/styles";
import { Ionicons } from '@expo/vector-icons';

interface CctvScreenProps {
  token: string;
}

export default function CctvScreen({ token }: CctvScreenProps) {
  const BASE_URL = "http://10.254.2.143:8080";

  const [visionScore, setVisionScore] = useState(0);
  const [audioScore, setAudioScore] = useState(0);
  const [behavior, setBehavior] = useState("영상을 업로드하고 분석을 시작하세요.");
  const [riskLevel, setRiskLevel] = useState("NORMAL");

  const [uploaded, setUploaded] = useState(false);
  const [videoUri, setVideoUri] = useState("");
  const [videoName, setVideoName] = useState("");
  const [loading, setLoading] = useState(false);

  const [videoHeight, setVideoHeight] = useState(200);
  const screenWidth = Dimensions.get("window").width;

  // 💡 파이썬 JSON에 등록된 정확한 실제 파일명 목록 (가운데 공백까지 완벽 반영)
  const validNames = [
    "(정상)문열고들어감2",
    "노크",
    "노크2",
    "뒤로지나감",
    "비번틀림반복",
    "사용자뒤접근", // 👈 공백 포함
    "외부인혼자지나감",
    "정상(문열고 들어감)", // 👈 괄호 및 공백 포함
    "카메라가림",
    "택배배달",
    "택배배달2"
  ];

  const pickVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "video/*" });
    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
      setVideoName(result.assets[0].name || "");
      setUploaded(true);
    }
  };

  // 💡 [버그 교정] 어떤 환경이든 undefined 에러 없이 안전하게 비율을 뽑아내는 함수
  const handleVideoReady = (event: any) => {
    // expo-av 버전에 따라 naturalSize가 바로 안 나오거나 다른 곳에 들어있을 수 있음
    const size = event?.naturalSize || event?.videoToDisplay || event?.target;

    if (size && size.width && size.height) {
      const aspectRatio = size.height / size.width;
      // 가로 너비(100% = 358px 기준)에 맞게 높이를 동적으로 계산
      // 컨테이너 크롭 없이 전체 화면이 깔끔하게 다 나오도록 높이 세팅
      setVideoHeight(screenWidth * aspectRatio * 0.9);
    } else {
      // 만약 사이즈를 못 가져오는 경우 기본 16:9 비율 유지
      setVideoHeight(screenWidth * aspectRatio * 0.9);
    }
  };

  const analyzeVideo = async () => {
    if (!token) {
      Alert.alert("인증 오류", "로그인 토큰이 유효하지 않습니다. 다시 로그인해 주세요.");
      return;
    }

    if (!videoUri) {
      Alert.alert("알림", "업로드된 영상이 없습니다.");
      return;
    }

    setLoading(true);

    try {
      const fileResponse = await fetch(videoUri);
      const rawBlob = await fileResponse.blob();

      // 1. 현재 사용자가 선택한 원본 파일명에서 확장자를 떼고 공백을 제거하여 정제합니다.
      // 예: "사용자뒤접근.mp4" -> "사용자뒤접근"
      const baseName = videoName.replace(/\.[^/.]+$/, "").replace(/\s+/g, "");

      // 2. 파이썬 JSON 유효 목록 중에서 사용자가 올린 파일명과 가장 유사한 뼈대 이름을 찾습니다.
      // 글자 공백을 무시하고 포함 여부를 판단하므로 "사용자뒤접근"을 올리면 "사용자뒤 접근"을 완벽하게 찾아냅니다.
      let matchedName = baseName;
      for (const validName of validNames) {
        const cleanValidName = validName.replace(/\s+/g, ""); // 비교용 공백 제거
        if (baseName.includes(cleanValidName) || cleanValidName.includes(baseName)) {
          matchedName = validName; // 파이썬이 원하는 진짜 이름 선택
          break;
        }
      }

      const targetFileName = `${matchedName}.mp4`;
      console.log("🔍 [이름 유연 매칭 결과] 최종 전송 파일명:", targetFileName);

      const fileBlob = new File([rawBlob], targetFileName, { type: "video/mp4" });

      const formData = new FormData();
      formData.append("file", fileBlob);

      const response = await fetch(`${BASE_URL}/api/ai/vision`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log("백엔드가 보내준 실시간 원본 JSON 데이터:", result);

      if (response.ok && result.success === true) {
        const aiData = result.data;

        let displayBehavior = "감지된 행동 없음";
        if (aiData.events) {
          displayBehavior = Array.isArray(aiData.events)
            ? aiData.events.join(", ")
            : String(aiData.events);
        }

        setBehavior(displayBehavior);
        setVisionScore(aiData.riskScore || 0);
        setRiskLevel(aiData.riskLevel || "NORMAL");

        Alert.alert("분석 완료", result.message || "성공적으로 AI 분석 데이터를 가져왔습니다.");
      } else {
        Alert.alert("분석 실패", result.message || "서버 응답 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("스프링부트 통신 실패:", error);
      Alert.alert("에러", "Spring Boot 서버 상태 또는 네트워크 연결을 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>OmniGuardy AI</Text>
      <Text style={styles.subtitle}>1학기 시연용 Prototype</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>CCTV 영상</Text>

          <TouchableOpacity
            style={[styles.uploadButton, uploaded && styles.analyzeButton]}
            onPress={uploaded ? analyzeVideo : pickVideo}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.uploadButtonText}>
                {uploaded ? "영상 분석 시작" : "영상 업로드"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={[
          styles.videoPlaceholder,
            {
              height: videoUri ? videoHeight : 240, // 영상이 있을 때만 동적 높이 적용!
              overflow: "hidden",
              backgroundColor: "#000",
              borderRadius: 12
            }
        ]}>
          {videoUri ? (
            <Video
              source={{ uri: videoUri }}
              useNativeControls
              shouldPlay={false}
              isLooping
              resizeMode={ResizeMode.CONTAIN} // 비율 유지하며 채우기
              onReadyForDisplay={handleVideoReady} // 👈 수정된 리스너 바인딩
              style={{ width: "100%", height: "100%" }}
            />
            ) : (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Ionicons name="images-outline" size={32} color="#4E515B" style={{ marginBottom: 8 }} />
                <Text style={styles.placeholderText}>CCTV 영상을 선택해 주세요.</Text>
              </View>
          )}
        </View>

        {uploaded && (
          <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
            <Ionicons name="document-attach-outline" size={14} color="#666" style={{ marginRight: 4 }} />
            <Text style={{ color: '#666', fontSize: 12 }} numberOfLines={1}>선택된 원본: {videoName}</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>감지 행동</Text>
        <Text style={styles.behavior}>{behavior}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>위험도 분석</Text>
        <Text style={styles.score}>Vision Score : {visionScore}</Text>
        {/*<Text style={styles.score}>Audio Score : {audioScore}</Text>*/}
      </View>

      <View style={[
        styles.alertBox,
        riskLevel === "NORMAL" && { backgroundColor: "#2ec4b6" },
        riskLevel === "LOW" && { backgroundColor: "#e9c46a" },
        riskLevel === "MIDDLE" && { backgroundColor: "#f4a261" },
        riskLevel === "HIGH" && { backgroundColor: "#e76f51" }
      ]}>
        <Text style={styles.alertTitle}>⚠ 위험 단계</Text>
        <Text style={styles.alertValue}>{riskLevel}</Text>
      </View>
    </ScrollView>
  );
}
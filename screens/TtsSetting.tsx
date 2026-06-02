import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { styles } from "../styles/styles";
import { Ionicons } from '@expo/vector-icons';

// 💡 부모(App.tsx)로부터 전역 토큰을 받기 위한 interface 선언
interface TtsSettingProps {
  token: string | null;
}

export default function TtsSetting({ token }: TtsSettingProps) {
  const [message, setMessage] = useState("위험 행동이 감지되었습니다. 즉시 중단하세요.");
  const [isLoading, setIsLoading] = useState(false);

  const sendTtsRequest = async () => {
    if (!message.trim()) {
      Alert.alert("알림", "송출할 문구를 입력해주세요.");
      return;
    }
    if (message.length > 100) {
      Alert.alert("경고 (TTS_001)", "TTS 문구는 100자 이하로 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const SERVER_URL = "http://10.254.2.143:8080/api/tts";

      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // 🔑 명세서 필수 요구사항: Bearer 토큰 주입
        },
        credentials: "include",
        body: JSON.stringify({
          message: message,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Alert.alert("성공", "라즈베리파이로 TTS 음성 송출 요청이 전송되었습니다.");
      } else {
        // 백엔드에서 에러 코드(errorCode)를 같이 내려줄 경우를 대비한 가독성 패치
        const errCode = result.errorCode ? ` (${result.errorCode})` : "";
        Alert.alert("실패" + errCode, result.message || "오류가 발생했습니다.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("연동 실패 (MQTT_001)", "서버와 통신할 수 없거나 MQTT 전송에 실패했습니다. 핫스팟 및 백엔드 상태를 확인하세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>OmniGuardy AI</Text>
      <Text style={styles.subtitle}>1학기 시연용 Prototype</Text>

      <Text style={[styles.cardTitle, { color: "blue", fontSize: 18, marginTop: 10, marginBottom: 16 }]}>
        음성 경고 설정
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💬 송출할 문구 입력</Text>
        <TextInput
          style={{
            backgroundColor: "#2D2F35",
            color: "white",
            padding: 12,
            borderRadius: 10,
            fontSize: 15,
            minHeight: 60,
            textAlignVertical: "top",
          }}
          placeholder="라즈베리파이 스피커로 출력할 경고 문구를 적으세요."
          placeholderTextColor="#666"
          multiline
          maxLength={100}
          value={message}
          onChangeText={setMessage}
        />
        <Text style={{ color: "#888", fontSize: 12, textAlign: "right", marginTop: 6 }}>
          {message.length} / 100자
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚨 자동 경고 방송 활성화</Text>
        <Text style={styles.behavior}>현재 상태: 실시간 작동 중</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔊 경고 오디오 선택</Text>
        <Text style={styles.score}>• 경고음 타입 A (기본 사이렌)</Text>
        <Text style={styles.score}>• 경고음 타입 B (TTS 안내 음성)</Text>
        <Text style={styles.score}>• 사용자 지정 녹음 파일</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.uploadButton,
          { alignItems: "center", paddingVertical: 14 },
          isLoading && { backgroundColor: "#555" }
        ]}
        onPress={sendTtsRequest}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.uploadButtonText}>📢 테스트 음성 송출</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
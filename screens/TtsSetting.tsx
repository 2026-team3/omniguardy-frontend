import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { styles } from "../styles/styles";

export default function TtsSetting() {
  // 1. 입력받을 문구 상태 관리
  const [message, setMessage] = useState("위험 행동이 감지되었습니다. 즉시 중단하세요.");
  // 2. 로딩 상태 관리 (API 호출 중 버튼 비활성화 및 로딩 표시)
  const [isLoading, setIsLoading] = useState(false);

  // 3. Spring Boot 백엔드 API 호출 함수
  const sendTtsRequest = async () => {
    // 글자 수 검증 (백엔드 예외 처리 조건 반영)
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
      // 💡 실제 Spring Boot 서버의 IP 주소와 포트를 적어주세요.
      // (주의: 로컬 PC 테스트 시 localhost 대신 실제 IP 주소인 192.168.x.x 형식을 적어야 모바일에서 접근 가능합니다)
      const SERVER_URL = "http://10.254.2.143:8080/api/tts";

      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Alert.alert("성공", "라즈베리파이로 TTS 음성 송출 요청이 전송되었습니다.");
      } else {
        // 백엔드 에러 발생 시 처리 (MQTT_001 등)
        Alert.alert("실패", result.message || "오류가 발생했습니다.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("연동 실패 (MQTT_001)", "서버와 통신할 수 없거나 MQTT 전송에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      {/* 타이틀 및 소제목 */}
      <Text style={styles.title}>OmniGuardy AI</Text>
      <Text style={styles.subtitle}>1학기 시연용 Prototype</Text>

      <Text style={[styles.cardTitle, { color: "blue", fontSize: 18, marginTop: 10, marginBottom: 16 }]}>
        음성 경고 설정
      </Text>

      {/* 4. [새로 추가] 실시간 문구 입력창 카드 */}
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
            textAlignVertical: "top", // 안드로이드 상단 정렬
          }}
          placeholder="라즈베리파이 스피커로 출력할 경고 문구를 적으세요."
          placeholderTextColor="#666"
          multiline
          maxLength={100} // 프론트엔드 단에서 100자 제한
          value={message}
          onChangeText={setMessage}
        />
        <Text style={{ color: "#888", fontSize: 12, textAlign: "right", marginTop: 6 }}>
          {message.length} / 100자
        </Text>
      </View>

      {/* 설정 카드 1 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚨 자동 경고 방송 활성화</Text>
        <Text style={styles.behavior}>현재 상태: 실시간 작동 중</Text>
      </View>

      {/* 설정 카드 2 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔊 경고 오디오 선택</Text>
        <Text style={styles.score}>• 경고음 타입 A (기본 사이렌)</Text>
        <Text style={styles.score}>• 경고음 타입 B (TTS 안내 음성)</Text>
        <Text style={styles.score}>• 사용자 지정 녹음 파일</Text>
      </View>

      {/* 5. 음성 송출 버튼 연동 */}
      <TouchableOpacity
        style={[
          styles.uploadButton,
          { alignItems: "center", paddingVertical: 14 },
          isLoading && { backgroundColor: "#555" } // 로딩 중일 때 버튼 색상 변경
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
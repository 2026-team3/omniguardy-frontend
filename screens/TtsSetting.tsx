import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "../styles/styles";

export default function TtsSetting() {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      {/* 1. CCTV 화면과 똑같은 메인 타이틀 유지 */}
      <Text style={styles.title}>OmniGuardy AI</Text>
      <Text style={styles.subtitle}>1학기 시연용 Prototype</Text>

      {/* 2. 여기에 새로 요청하신 음성 설정 전용 소제목 추가 */}
      <Text style={[styles.cardTitle, { color: "blue", fontSize: 18, marginTop: 10, marginBottom: 16 }]}>
        음성 경고 설정
      </Text>

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

      <TouchableOpacity style={[styles.uploadButton, { alignItems: "center", paddingVertical: 14 }]}>
        <Text style={styles.uploadButtonText}>📢 테스트 음성 송출</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
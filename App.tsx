import React from "react";
import { styles } from "./styles/styles";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function App() {

  const visionScore = 72;
  const audioScore = 35;

  return (
  <View style={styles.phoneFrame}>
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <Text style={styles.title}>
          OmniGuardy AI
        </Text>
        <Text style={styles.subtitle}>
          Smart CCTV Monitoring
        </Text>

        {/* 영상 영역 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            CCTV 영상
          </Text>
          <View style={styles.videoPlaceholder}>
            <Text style={styles.placeholderText}>
              CCTV 영상 영역
            </Text>
          </View>
        </View>

        {/* 행동 감지 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            감지 행동
          </Text>
          <Text style={styles.behavior}>
            문 안쪽 확인 시도 (A20)
          </Text>
        </View>

        {/* 위험도 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            위험도 분석
          </Text>
          <Text style={styles.score}>
            Vision Score : {visionScore}
          </Text>
          <Text style={styles.score}>
            Audio Score : {audioScore}
          </Text>

        </View>

        {/* 최종 경고 */}
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>
            ⚠ 위험 단계
          </Text>
          <Text style={styles.alertValue}>
            HIGH
          </Text>
        </View>

      </ScrollView>

    </SafeAreaView>
  </View>
  );
}


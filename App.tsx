import React from "react";
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
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#101114",
  },

  scroll: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
    marginTop: 20,
  },

  subtitle: {
    color: "#B0B3B8",
    fontSize: 15,
    marginTop: 6,
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#1B1D22",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },

  cardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 14,
  },

  videoPlaceholder: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    color: "#888",
    fontSize: 18,
  },

  behavior: {
    color: "#FFCC66",
    fontSize: 18,
    fontWeight: "600",
  },

  score: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },

  alertBox: {
    backgroundColor: "#8B0000",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginTop: 10,
  },

  alertTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  alertValue: {
    color: "white",
    fontSize: 34,
    fontWeight: "800",
  },

});
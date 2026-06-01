import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { styles } from "../styles/styles"; // 경로 확인 필요

export default function CctvScreen() {
  const visionScore = 72;
  const audioScore = 35;
  const [uploaded, setUploaded] = useState(false);
  const [videoUri, setVideoUri] = useState("");

  const pickVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "video/*" });
    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
      setUploaded(true);
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

      <View style={styles.card}>
        <Text style={styles.cardTitle}>감지 행동</Text>
        <Text style={styles.behavior}>문 안쪽 확인 시도 (A20)</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>위험도 분석</Text>
        <Text style={styles.score}>Vision Score : {visionScore}</Text>
        <Text style={styles.score}>Audio Score : {audioScore}</Text>
      </View>

      <View style={styles.alertBox}>
        <Text style={styles.alertTitle}>⚠ 위험 단계</Text>
        <Text style={styles.alertValue}>HIGH</Text>
      </View>
    </ScrollView>
  );
}
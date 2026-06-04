import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "white",
  },
  phoneFrame: {
    marginLeft: 50,
    width: 390,
    height: 840,

    borderRadius: 40,
    overflow: "hidden",

    borderWidth: 5,
    borderColor: "#111",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,

    elevation: 20,
  },

  scroll: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    color: "blue",
    fontSize: 32,
    fontWeight: "700",
    marginTop: 10,
  },

  subtitle: {
    color: "gray",
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

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  uploadButton: {
    backgroundColor: "#2D7FF9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  analyzeButton: {
    backgroundColor: "#fcb500",
  },

  uploadButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },

  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 14,
  },

  videoPlaceholder: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    backgroundColor: "black",
    overflow: "hidden",
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

  // 사이드바
  headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    hamburgerButton: {
      padding: 5,
      marginTop: 15
    },
    hamburgerIcon: {
      color: "gray",
      fontSize: 24,
      fontWeight: "bold",
    },
    headerTitleText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    sidebar: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 260, // phoneFrame(390) 내부에서 차지할 너비
      backgroundColor: "#1B1D22", // 카드와 동일한 다크 배경색
      zIndex: 999, // 최상단으로 띄우기
      padding: 20,
      paddingTop: 50,
      borderRightWidth: 1,
      borderColor: "#2D2F35",

      flexDirection: "column",
    },
    sidebarHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 30,
    },
    sidebarMenuTitle: {
      color: "#fff",
      fontSize: 20,
      fontWeight: "700",
    },
    closeButtonText: {
      color: "#888",
      fontSize: 20,
      padding: 5,
    },
    sidebarItem: {
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: "#2D2F35",
      flexDirection: "row",
      alignItems: "center"
    },
    sidebarItemText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "500",
      marginLeft: 10,
    },

});
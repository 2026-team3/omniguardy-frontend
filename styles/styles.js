import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#white",
  },
  phoneFrame: {
    width: 390,
    height: 844,

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
    marginTop: 20,
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
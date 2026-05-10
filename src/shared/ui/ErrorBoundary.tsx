import { Component, ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { colors, fontFamily } from "@shared/theme";

interface ErrorBoundaryProps {
  children: ReactNode;
  screenName: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `[ErrorBoundary] ${this.props.screenName}:`,
      error,
      errorInfo.componentStack,
    );
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, showDetails: false });
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const error = this.state.error;
      return (
        <View style={styles.wrap}>
          <ScrollView
            contentContainerStyle={styles.card}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.iconWrap}>
              <AlertTriangle size={32} color={colors.fontInverse} />
            </View>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>
              {error?.name ?? "Error"}: {error?.message ?? "Unknown error"}
            </Text>
            <Text style={styles.screenName}>
              Screen: {this.props.screenName}
            </Text>
            <Pressable style={styles.detailToggle} onPress={this.toggleDetails}>
              <Text style={styles.detailToggleText}>
                {this.state.showDetails ? "Hide details" : "Show details"}
              </Text>
            </Pressable>
            {this.state.showDetails && error?.stack && (
              <View style={styles.stackWrap}>
                <Text style={styles.stackText} selectable>
                  {error.stack}
                </Text>
              </View>
            )}
            <Pressable style={styles.btn} onPress={this.handleReset}>
              <Text style={styles.btnText}>Try Again</Text>
            </Pressable>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  card: {
    alignItems: "center",
    gap: 16,
    padding: 32,
    paddingTop: 60,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accentRed,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: colors.fontPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.fontSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  screenName: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.fontTertiary,
    textAlign: "center",
  },
  detailToggle: {
    paddingVertical: 4,
  },
  detailToggleText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.accent,
    textDecorationLine: "underline",
  },
  stackWrap: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 10,
    padding: 12,
    width: "100%",
  },
  stackText: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.fontSecondary,
    lineHeight: 16,
    fontVariant: ["tabular-nums"],
  },
  btn: {
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 22,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  btnText: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    color: colors.fontInverse,
  },
});

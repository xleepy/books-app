import { Component, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { colors, fontFamily } from "@shared/theme";

interface ErrorBoundaryProps {
  children: ReactNode;
  screenName: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
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
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.wrap}>
          <View style={styles.card}>
            <View style={styles.iconWrap}>
              <AlertTriangle size={32} color={colors.fontInverse} />
            </View>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>
              An unexpected error occurred on the{" "}
              {this.props.screenName} screen.
            </Text>
            <Pressable style={styles.btn} onPress={this.handleReset}>
              <Text style={styles.btnText}>Try Again</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgPrimary,
    padding: 32,
  },
  card: {
    alignItems: "center",
    gap: 16,
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

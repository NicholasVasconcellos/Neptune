import { View, Image } from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Card, Button, Text, LoadingIndicator } from "@/components/ui";
import Logo from "@/assets/NeptuneAppIcon.png";
import { useAuth } from "@/context/AuthContext";
import { useThemeColors } from "@/hooks/useThemeColors";

const Home = () => {
  const { session, loading } = useAuth();
  const colors = useThemeColors();

  useEffect(() => {
    if (!loading && session) {
      router.replace("/(tabs)" as any);
    }
  }, [session, loading]);

  if (loading) {
    return <LoadingIndicator className="bg-background" />;
  }

  if (session) return null;

  return (
    <View className="flex-1 items-center justify-center self-center gap-1">
      <Card>
        <Text variant="title" className="font-bold">
          Welcome to Neptune Swim
        </Text>
      </Card>
      <Image
        source={Logo}
        style={{ width: 300, height: 300, alignSelf: "center", marginBottom: 20 }}
        resizeMode="contain"
      />
      <Button
        href="/login"
        icon={<Ionicons name="log-in-outline" size={20} color={colors.onPrimary} />}
      >
        Login To Account
      </Button>
      <Button
        href="/register"
        variant="outlined"
        icon={<Ionicons name="person-add-outline" size={20} color={colors.primary} />}
      >
        Create new Account
      </Button>
    </View>
  );
};

export default Home;

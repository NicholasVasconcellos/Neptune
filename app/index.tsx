import { View, Image, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Card, Button, Text } from "../components/ui";
import Logo from "../assets/NeptuneAppIcon.png";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) {
      router.replace("/(tabs)" as any);
    }
  }, [session, loading]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#4fc3f7" />
      </View>
    );
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
        icon={<Ionicons name="log-in-outline" size={20} color="#fff" />}
      >
        Login To Account
      </Button>
      <Button
        href="/register"
        variant="outlined"
        icon={<Ionicons name="person-add-outline" size={20} color="#4fc3f7" />}
      >
        Create new Account
      </Button>
    </View>
  );
};

export default Home;

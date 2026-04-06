import { View, Image, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Card, Button, Text, Divider } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { useThemeColors } from "../../hooks/useThemeColors";
import { supabase } from "../../lib/supabase";
import Logo from "../../assets/NeptuneAppIcon.png";

const Home = () => {
  const { session } = useAuth();
  const colors = useThemeColors();

  useEffect(() => {
    if (!session) {
      router.replace("../" as any);
    }
  }, [session]);

  return (
    <ScrollView
      className="bg-background"
      contentContainerStyle={{
        alignSelf: "center",
        alignItems: "stretch",
        gap: 4,
        paddingVertical: 20,
      }}
    >
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

      <Card>
        <Text variant="title" className="font-bold text-base">
          Welcome to Neptune Swim
        </Text>
        <Text>Logged in as {session?.user?.email}</Text>
      </Card>

      <Divider className="my-2" />

      <Button
        href="/viewData"
        icon={<Ionicons name="bar-chart-outline" size={20} color={colors.onPrimary} />}
      >
        View Metrics
      </Button>

      <Button
        href="/addTraining"
        variant="outlined"
        icon={<Ionicons name="document-text-outline" size={20} color={colors.primary} />}
      >
        Add New Training
      </Button>

      <Button
        href="/viewTraining"
        variant="outlined"
        icon={<Ionicons name="play-outline" size={20} color={colors.primary} />}
      >
        Start Training
      </Button>

      <Button
        onPress={() => supabase.auth.signOut()}
        variant="text"
        icon={<Ionicons name="log-out-outline" size={20} color={colors.primary} />}
      >
        Log Out
      </Button>
    </ScrollView>
  );
};

export default Home;

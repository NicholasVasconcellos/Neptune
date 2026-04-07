import { View, Image } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { Card, Button, Text } from "@/components/ui";
import { AppLogo } from "@/constants/images";
import { useThemeColors } from "@/hooks/useThemeColors";

const Home = () => {
  const colors = useThemeColors();

  return (
    <View className="flex-1 items-center justify-center self-center gap-1">
      <Card>
        <Text variant="title" className="font-bold">
          Welcome to Neptune Swim
        </Text>
      </Card>
      <Image
        source={AppLogo}
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
